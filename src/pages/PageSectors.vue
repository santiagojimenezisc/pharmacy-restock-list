<template>
    <Skeleton v-if="isLoading" height="20rem" />
    <Message v-else-if="errorMessage" severity="error">{{ errorMessage }}</Message>
    <div v-else>
        <h1 class="text-3xl font-semibold">Listas de compras</h1>
        <ListSectors :sectorsList="sectorsList" />
    </div>
</template>


<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getSectorsSummary } from '@/services/sectors'
import ListSectors from '@/components/ListSectors.vue'
import type { SectorList } from '@/interfaces'
import { Message, Skeleton } from 'primevue'

const errorMessage = ref("")
const isLoading = ref(false)
const sectorsList = ref<SectorList[]>([])


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

onMounted(loadSectors)
</script>