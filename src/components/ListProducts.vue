<template>
    <div
        class="flex flex-col gap-4 xl:grid xl:grid-cols-[minmax(0,1fr)_18rem] xl:grid-rows-[auto_auto_1fr] xl:items-start">
        <nav aria-label="Ruta" class="flex items-baseline gap-2 xl:col-start-1">
            <RouterLink to="/" class="text-muted-color hover:text-color">Anaqueles</RouterLink>
            <span aria-hidden="true" class="text-muted-color">/</span>
            <h1 class="text-3xl font-semibold">{{ nameSector }}</h1>
        </nav>

        <section
            class="flex flex-col gap-2 p-4 rounded-lg border border-surface bg-surface-0 dark:bg-surface-900 xl:col-start-2 xl:row-start-1 xl:row-span-3 xl:sticky xl:top-6">
            <h2 class="uppercase font-mono text-xs max-xl:hidden">Resumen del anaquel</h2>
            <div>
                <div class="uppercase font-mono text-xs">Por comprar</div>
                <div class="text-3xl">{{ formatCurrency(totalIncomplete) }}</div>
            </div>
            <Button label="Ver desglose" :icon="showBreakdown ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"
                iconPos="right" text class="w-full xl:hidden!" :aria-expanded="showBreakdown"
                @click="showBreakdown = !showBreakdown" />

            <dl :class="showBreakdown ? 'flex' : 'hidden xl:flex'" class="flex-col gap-2">
                <div class="flex justify-between">
                    <dt>Comprados</dt>
                    <dd>{{ formatCurrency(totalComplete) }}</dd>
                </div>
                <div class="flex justify-between">
                    <dt>Por comprar</dt>
                    <dd>{{ formatCurrency(totalIncomplete) }}</dd>
                </div>
                <div class="flex justify-between">
                    <dt>Total del anaquel</dt>
                    <dd>{{ formatCurrency(totalProducts) }}</dd>
                </div>
            </dl>
        </section>

        <div class="flex flex-wrap items-center gap-4 xl:col-start-1">
            <IconField class="grow basis-64">
                <InputIcon class="pi pi-search" />
                <InputText v-model="barSearch" type="text" placeholder="Buscar producto" class="w-full" />
            </IconField>
            <SelectButton v-model="statusFilter" :options="filterOptions" optionLabel="label" optionValue="value"
                :allowEmpty="false" size="small" class="shrink-0 max-xl:w-full max-xl:*:flex-1 *:whitespace-nowrap" />
        </div>

        <ul v-if="productsFiltered.length" class="rounded-lg border border-surface bg-surface-0 dark:bg-surface-900 xl:col-start-1">
            <li v-for="({ id, name, laboratoryName, supplierName, quantity, price, isComplete, description }) in productsFiltered"
                :key="id"
                class="grid grid-cols-[auto_minmax(0,1fr)_auto_auto] xl:grid-cols-[auto_minmax(0,1fr)_9rem_auto_6rem_auto] items-center gap-3 p-3 border-surface not-first:border-t hover:bg-emphasis">
                <Checkbox :modelValue="isComplete" :inputId="String(id)" binary size="large"
                    class="[--p-checkbox-lg-width:1.75rem] [--p-checkbox-lg-height:1.75rem] [--p-checkbox-icon-lg-size:1rem]"
                    @update:modelValue="checkedProductList(id)" />
                <Label :for="id" class="flex flex-col items-start! text-left">
                    <span>{{ name }}</span>
                    <span class="text-muted-color max-xl:hidden">{{ laboratoryName }} · {{ description }}</span>
                    <span class="text-muted-color xl:hidden">{{ description }} · {{ quantity }} {{ quantity === 1 ? 'pza' : 'pzas' }}</span>
                </Label>
                <p class="text-muted-color text-right max-xl:hidden">
                    {{ formatCurrency(price) }} × {{ quantity }} {{ quantity === 1 ? 'pza' : 'pzas' }}
                </p>
                <Avatar :label="getInitials(supplierName)" shape="circle" v-tooltip="supplierName" class="max-xl:hidden!" />
                <p class="text-right">{{ formatCurrency(price * quantity) }}</p>
                <Button icon="pi pi-ellipsis-v" text rounded severity="secondary" :aria-label="`Opciones de ${name}`"
                    aria-haspopup="true" aria-controls="product-menu" @click="openMenu($event, id)" />
            </li>
        </ul>
        <Menu ref="menu" id="product-menu" :model="menuItems" popup />
        <Message v-if="productsList.length === 0" severity="warn" class="xl:col-start-1">
            <template #icon>
                <i class="pi pi-info-circle"></i>
            </template>
            Aun no tienes productos agregados a esta lista
        </Message>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, toRefs, useTemplateRef } from 'vue'
import { Avatar, Button, Checkbox, IconField, InputIcon, InputText, Label, Menu, SelectButton } from 'primevue'
import type { MenuItem } from 'primevue/menuitem'
import Message from 'primevue/message'
import { useToast } from 'primevue/usetoast'
import { formatCurrency, getInitials, normalizeText } from '@/helpers/commons'
import type { Product } from '@/interfaces'
import { toggleProductStatus } from '@/services/products'

const props = defineProps<{
    nameSector: string,
    productsList: Product[]
}>()

const emit = defineEmits<{
    edit: [product: Product]
    delete: [product: Product]
}>()

const { nameSector, productsList } = toRefs(props)
const barSearch = ref("")
const statusFilter = ref<'all' | 'pending' | 'complete'>('all')
const showBreakdown = ref(false)
const toast = useToast()
const menu = useTemplateRef<InstanceType<typeof Menu>>('menu')
const selectedProduct = ref<Product | null>(null)

const menuItems: MenuItem[] = [
    {
        label: 'Editar',
        icon: 'pi pi-pencil',
        command: () => {
            if (selectedProduct.value) emit('edit', selectedProduct.value)
        }
    },
    {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        class: '**:text-red-600! dark:**:text-red-400!',
        command: () => {
            if (selectedProduct.value) emit('delete', selectedProduct.value)
        }
    }
]

const openMenu = (event: Event, id: number) => {
    selectedProduct.value = productsList.value.find((product) => product.id === id) ?? null
    menu.value?.toggle(event)
}

const checkedProductList = async (id: number) => {
    const product = productsList.value.find((product: Product) => product.id === id)
    if (!product) return

    const previous = product.isComplete
    product.isComplete = !previous

    try {
        await toggleProductStatus(id, previous)
    } catch (error) {
        product.isComplete = previous
        console.error(error)
        toast.add({
            severity: 'error',
            summary: 'No se pudo actualizar',
            detail: 'Algo salió mal. Inténtalo de nuevo.',
            life: 4000
        })
    }
}

const filterOptions = computed(() => {
    const pending = productsList.value.filter((product: Product) => !product.isComplete).length
    return [
        { label: `Todos ${productsList.value.length}`, value: 'all' },
        { label: `Pendientes ${pending}`, value: 'pending' },
        { label: `Comprados ${productsList.value.length - pending}`, value: 'complete' }
    ]
})

const productsFiltered = computed(() => {
    const search = normalizeText(barSearch.value);
    return productsList.value.filter((product: Product) =>
        (statusFilter.value === 'all' || product.isComplete === (statusFilter.value === 'complete')) &&
        normalizeText(product.name).includes(search)
    )
})

// Los totales son del anaquel completo; el buscador solo cambia lo que se ve en la lista
const totalIncomplete = computed(() =>
    productsList.value
        .filter((product: Product) => !product.isComplete)
        .reduce((total, product) => total + product.price * product.quantity, 0)
);

const totalComplete = computed(() =>
    productsList.value
        .filter((product: Product) => product.isComplete)
        .reduce((total, product) => total + product.price * product.quantity, 0)
);

const totalProducts = computed(() => totalIncomplete.value + totalComplete.value);
</script>