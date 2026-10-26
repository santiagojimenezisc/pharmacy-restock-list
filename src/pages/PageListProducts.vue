<template>
    <!-- pb-24 deja un espacio al final para que el botón flotante no tape los totales -->
    <div class="pb-24">
        <RouterLink to="/" class="inline-flex items-center gap-2 mb-4 text-surface-400 hover:text-surface-0">
            <i class="pi pi-arrow-left"></i>
            Volver a los anaqueles
        </RouterLink>

        <Skeleton v-if="isLoading" height="20rem" />
        <Message v-else-if="errorMessage" severity="error">{{ errorMessage }}</Message>
        <ListProducts v-else :nameSector="sectorName" :productsList="productsList" />
    </div>

    <div v-if="!showAddProduct" class="fixed bottom-6 right-6">
        <Button label="Agregar" icon="pi pi-plus" size="large" rounded raised @click="showAddProduct = true" />
    </div>

    <Dialog v-model:visible="showAddProduct" header="Agregar producto" modal :style="{ width: '50rem' }"
        :breakpoints="{ '640px': '100vw' }"
        class="max-sm:h-dvh! max-sm:max-h-dvh! max-sm:rounded-none!">
        <AddProduct @created="onProductCreated" />
    </Dialog>
</template>

<script setup lang="ts">
import AddProduct from '@/components/AddProduct.vue'
import ListProducts from '@/components/ListProducts.vue'
import type { Product } from '@/interfaces'
import { getProductsBySector } from '@/services/sectors'
import { Button, Dialog, Message, Skeleton } from 'primevue'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const errorMessage = ref("")
const isLoading = ref(false)
const productsList = ref<Product[]>([])
const showAddProduct = ref(false)
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

// Recarga sin el Skeleton para que la lista no parpadee detrás del modal que se cierra
const onProductCreated = async () => {
    showAddProduct.value = false
    try {
        productsList.value = await getProductsBySector(sectorId)
    } catch (error) {
        console.error(error)
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