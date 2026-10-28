<template>
    <!-- pb-24 deja un espacio al final para que el botón flotante no tape los totales -->
    <div class="pb-24 lg:pb-0">
        <Skeleton v-if="isLoading" height="20rem" />
        <Message v-else-if="errorMessage" severity="error">{{ errorMessage }}</Message>
        <ListProducts v-else :nameSector="sectorName" :productsList="productsList" @add="openNewProduct"
            @edit="openEditProduct" @delete="confirmDeleteProduct" />
    </div>

    <div v-if="!showProductForm" class="fixed bottom-6 right-6 lg:hidden">
        <Button label="Agregar producto" icon="pi pi-plus" size="large" rounded raised @click="openNewProduct" />
    </div>

    <ProductDialog v-model:visible="showProductForm" :product="editingProduct" :sectorId="sectorId"
        :sectorName="sectorName" @saved="refreshProducts" />
</template>

<script setup lang="ts">
import ProductDialog from '@/components/ProductDialog.vue'
import ListProducts from '@/components/ListProducts.vue'
import type { Product } from '@/interfaces'
import { deleteProduct } from '@/services/products'
import { getProductsBySector } from '@/services/sectors'
import { Button, Message, Skeleton } from 'primevue'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const errorMessage = ref("")
const isLoading = ref(false)
const productsList = ref<Product[]>([])
const showProductForm = ref(false)
const editingProduct = ref<Product | null>(null)
const confirm = useConfirm()
const toast = useToast()

const openNewProduct = () => {
    editingProduct.value = null
    showProductForm.value = true
}

const openEditProduct = (product: Product) => {
    editingProduct.value = product
    showProductForm.value = true
}
const route = useRoute()
const sectorId = Number(route.params.id)

const loadProducts = async () => {
    isLoading.value = true
    errorMessage.value = ""
    try {
        productsList.value = await getProductsBySector(sectorId)
    } catch (error) {
        errorMessage.value = "Ocurrió un problema al cargar los productos. Inténtalo más tarde."
        console.error(error)
    } finally {
        isLoading.value = false
    }
}

const refreshProducts = async () => {
    try {
        productsList.value = await getProductsBySector(sectorId)
    } catch (error) {
        console.error(error)
    }
}

const confirmDeleteProduct = (product: Product) => {
    confirm.require({
        header: 'Eliminar producto',
        message: `¿Eliminar "${product.name} ${product.laboratoryName}"? Esta acción no se puede deshacer.`,
        icon: 'pi pi-exclamation-triangle',
        defaultFocus: 'reject',
        rejectProps: { label: 'Cancelar', severity: 'secondary', outlined: true },
        acceptProps: { label: 'Eliminar', icon: 'pi pi-trash', severity: 'danger' },
        accept: () => removeProduct(product)
    })
}

const removeProduct = async (product: Product) => {
    try {
        await deleteProduct(product.id)
        toast.add({
            severity: 'success',
            summary: 'Producto eliminado',
            detail: `${product.name} se eliminó de la lista.`,
            life: 4000
        })
        refreshProducts()
    } catch (error) {
        console.error(error)
        toast.add({
            severity: 'error',
            summary: 'No se pudo eliminar',
            detail: 'Revisa tu conexión e inténtalo de nuevo.',
            life: 5000
        })
    }
}

const sectorName = computed(() => {
    const name = route.query.name
    return typeof name === "string" ? name : ""
})

onMounted(() => {
    loadProducts()
})
</script>