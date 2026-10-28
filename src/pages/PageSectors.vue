<template>
    <Skeleton v-if="isLoading" height="20rem" />
    <Message v-else-if="errorMessage" severity="error">{{ errorMessage }}</Message>
    <!-- pb-24 deja un espacio al final para que el botón flotante no tape las tarjetas -->
    <div v-else class="flex flex-col gap-6 pb-24 lg:pb-0">
        <div class="flex items-center justify-between gap-4">
            <h1 class="text-3xl font-semibold">Anaqueles</h1>
            <Button label="Agregar producto" icon="pi pi-plus" class="max-lg:hidden!" @click="openNewProduct(null)" />
        </div>
        <ListSectors :sectorsList="sectorsList" @add="openNewProduct" />
    </div>

    <div v-if="!showProductForm" class="fixed bottom-6 right-6 lg:hidden">
        <Button label="Agregar producto" icon="pi pi-plus" size="large" rounded raised @click="openNewProduct(null)" />
    </div>

    <ProductDialog v-model:visible="showProductForm" :product="null" :sectorId="selectedSector?.sectorId ?? null"
        :sectorName="selectedSector?.sectorName" @saved="refreshSectors" />
</template>


<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getSectorsSummary } from '@/services/sectors'
import ListSectors from '@/components/ListSectors.vue'
import ProductDialog from '@/components/ProductDialog.vue'
import type { SectorList } from '@/interfaces'
import { Button, Message, Skeleton } from 'primevue'

const errorMessage = ref("")
const isLoading = ref(false)
const sectorsList = ref<SectorList[]>([])
const showProductForm = ref(false)
const selectedSector = ref<SectorList | null>(null)

const loadSectors = async () => {
    isLoading.value = true
    errorMessage.value = ""
    try {
        sectorsList.value = await getSectorsSummary()
    } catch (error) {
        errorMessage.value = "Ocurrió un problema al cargar los anaqueles. Inténtalo más tarde."
        console.error(error)
    } finally {
        isLoading.value = false
    }
}

const refreshSectors = async () => {
    try {
        sectorsList.value = await getSectorsSummary()
    } catch (error) {
        console.error(error)
    }
}

const openNewProduct = (sector: SectorList | null) => {
    selectedSector.value = sector
    showProductForm.value = true
}

onMounted(loadSectors)
</script>
