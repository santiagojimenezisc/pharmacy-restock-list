<template>
    <div class="px-6 py-4 rounded-lg border border-surface bg-surface-900">
        <div class="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 class="text-3xl font-semibold">{{ nameSector }}</h1>
            <IconField>
                <InputIcon class="pi pi-search" />
                <InputText v-model="barSearch" type="text" placeholder="Buscar producto" />
            </IconField>
        </div>
        <div class="flex flex-col gap-2 mt-4">
            <div v-for="({ id, name, laboratoryName, supplierName, quantity, price, isComplete, description }) in productsFiltered"
                :key="id" class="flex items-center justify-between gap-2 p-4 rounded hover:bg-emphasis">
                <div class="flex items-center gap-2">
                    <Checkbox :modelValue="isComplete" :inputId="String(id)" binary size="large"
                        @update:modelValue="checkedProductList(id)" />

                    <Label :for="id" class="text-surface-500">{{ name + ' ' + laboratoryName + ' ' + description
                    }}</Label>
                </div>
                <div class="flex items-center gap-4">
                    <p class="text-surface-500">
                        {{ formatCurrency(price) }} × {{ quantity }} {{ quantity === 1 ? 'pza' : 'pzas' }}
                    </p>
                    <p>{{ formatCurrency(price * quantity) }}</p>
                    <Avatar :label="getInitials(supplierName)" shape="circle" v-tooltip="supplierName" />
                    <Button icon="pi pi-ellipsis-v" text rounded severity="secondary" :aria-label="`Opciones de ${name}`"
                        aria-haspopup="true" aria-controls="product-menu" @click="openMenu($event, id)" />
                </div>
            </div>
        </div>
        <Menu ref="menu" id="product-menu" :model="menuItems" popup />
        <div v-if="productsList.length === 0">
            <Message severity="warn">
                <template #icon>
                    <i class="pi pi-info-circle"></i>
                </template>
                Aun no tienes productos agregados a esta lista
            </Message>
        </div>
        <Divider />

        <div class="flex justify-between">
            <div>
                <div class="uppercase font-mono text-xs">Por comprar</div>
                <div class="font-light">{{ formatCurrency(totalIncomplete) }}</div>
            </div>
            <Divider layout="vertical" />
            <div>
                <div class="uppercase font-mono text-xs">Comprados</div>
                <div class="font-light">{{ formatCurrency(totalComplete) }}</div>
            </div>
            <Divider layout="vertical" />
            <div>
                <div class="uppercase font-mono text-xs">Total del anaquel</div>
                <div class="font-light">{{ formatCurrency(totalProducts) }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, toRefs, useTemplateRef } from 'vue'
import { Avatar, Button, Checkbox, IconField, InputIcon, InputText, Label, Divider, Menu } from 'primevue'
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

const emit = defineEmits<{ edit: [product: Product] }>()

const { nameSector, productsList } = toRefs(props)
const barSearch = ref("")
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

const productsFiltered = computed(() => {
    const search = normalizeText(barSearch.value);
    if (!search) {
        return productsList.value;
    }
    return productsList.value.filter((product: Product) =>
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