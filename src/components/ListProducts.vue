<template>
    <div
        class="flex flex-col gap-4 xl:grid xl:grid-cols-[minmax(0,1fr)_18rem] xl:grid-rows-[auto_auto_1fr] xl:items-start">
        <div class="flex items-center justify-between gap-4 xl:col-start-1">
            <nav aria-label="Ruta" class="flex items-baseline gap-2">
                <RouterLink to="/" class="text-muted-color hover:text-color">Anaqueles</RouterLink>
                <span aria-hidden="true" class="text-muted-color">/</span>
                <h1 class="text-3xl font-semibold">{{ nameSector }}</h1>
            </nav>
            <Button label="Agregar producto" icon="pi pi-plus" class="max-lg:hidden!" @click="emit('add')" />
        </div>

        <SectorSummary :products="productsList"
            class="xl:fixed xl:top-0 xl:right-0 xl:w-72 xl:h-screen xl:overflow-y-auto xl:rounded-none xl:border-0 xl:border-l" />

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
                <Label :for="id" class="flex flex-col items-start! gap-0.5! text-left">
                    <span>{{ name }}</span>
                    <span class="text-muted-color max-xl:hidden">{{ laboratoryName }} · {{ description }}</span>
                    <span class="text-muted-color xl:hidden">{{ description }} · {{ quantity }} {{ quantity === 1 ? 'pza' : 'pzas' }}</span>
                </Label>
                <p class="text-muted-color text-right max-xl:hidden">
                    {{ formatCurrency(price) }} × {{ quantity }} {{ quantity === 1 ? 'pza' : 'pzas' }}
                </p>
                <Avatar :label="getInitials(supplierName || 'Otro')" shape="circle" class="max-xl:hidden!" />
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
import SectorSummary from '@/components/SectorSummary.vue'

const props = defineProps<{
    nameSector: string,
    productsList: Product[]
}>()

const emit = defineEmits<{
    add: []
    edit: [product: Product]
    delete: [product: Product]
}>()

const { nameSector, productsList } = toRefs(props)
const barSearch = ref("")
const statusFilter = ref<'all' | 'pending' | 'complete'>('all')
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
</script>