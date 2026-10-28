<template>
  <Skeleton v-if="isLoading" height="20rem" />
  <Message v-else-if="errorMessage" severity="error">{{ errorMessage }}</Message>
  <!-- pb-24 deja un espacio al final para que el botón flotante no tape las tarjetas -->
  <div v-else class="flex flex-col gap-6 pb-24 lg:pb-0">
    <div class="flex items-center justify-between gap-4">
      <h1 class="text-3xl font-semibold">Anaqueles</h1>
      <Button
        label="Agregar anaquel"
        icon="pi pi-plus"
        class="max-lg:hidden!"
        @click="showSectorForm = true"
      />
    </div>
    <ListSectors
      :sectorsList="sectorsList"
      @add="openNewProduct"
      @rename="renameSector"
      @delete="confirmDeleteSector"
    />
  </div>

  <div v-if="!showSectorForm && !showProductForm" class="fixed bottom-6 right-6 lg:hidden">
    <Button
      label="Agregar anaquel"
      icon="pi pi-plus"
      size="large"
      rounded
      raised
      @click="showSectorForm = true"
    />
  </div>

  <SectorDialog
    v-model:visible="showSectorForm"
    :existingNames="sectorNames"
    @created="goToSector"
  />

  <ProductDialog
    v-model:visible="showProductForm"
    :product="null"
    :sectorId="selectedSector?.sectorId ?? null"
    :sectorName="selectedSector?.sectorName"
    @saved="refreshSectors"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button, Message, Skeleton } from 'primevue'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import ListSectors from '@/components/ListSectors.vue'
import ProductDialog from '@/components/ProductDialog.vue'
import SectorDialog from '@/components/SectorDialog.vue'
import { getErrorMessage, isNameTaken } from '@/helpers/commons'
import type { SectorList } from '@/interfaces'
import { deleteSector, getSectorsSummary, updateSector } from '@/services/sectors'

const errorMessage = ref('')
const isLoading = ref(false)
const sectorsList = ref<SectorList[]>([])
const showSectorForm = ref(false)
const showProductForm = ref(false)
const selectedSector = ref<SectorList | null>(null)
const router = useRouter()
const confirm = useConfirm()
const toast = useToast()

const sectorNames = computed(() => sectorsList.value.map((sector) => sector.sectorName))

const loadSectors = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    sectorsList.value = await getSectorsSummary()
  } catch (error) {
    errorMessage.value = 'Ocurrió un problema al cargar los anaqueles. Inténtalo más tarde.'
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

const openNewProduct = (sector: SectorList) => {
  selectedSector.value = sector
  showProductForm.value = true
}

const goToSector = (id: number, name: string) => {
  router.push({ path: `/sectors/${id}`, query: { name } })
}

const renameSector = async (sector: SectorList, name: string) => {
  const otherNames = sectorNames.value.filter((existing) => existing !== sector.sectorName)
  if (isNameTaken(name, otherNames)) {
    toast.add({
      severity: 'warn',
      summary: 'Nombre repetido',
      detail: `Ya existe un anaquel llamado ${name}.`,
      life: 4000,
    })
    return
  }

  try {
    await updateSector(sector.sectorId, { name })
    toast.add({
      severity: 'success',
      summary: 'Nombre actualizado',
      detail: `${sector.sectorName} ahora se llama ${name}.`,
      life: 4000,
    })
    refreshSectors()
  } catch (error) {
    console.error(error)
    toast.add({
      severity: 'error',
      summary: 'No se pudo cambiar el nombre',
      detail: getErrorMessage(error),
      life: 5000,
    })
  }
}

const confirmDeleteSector = (sector: SectorList) => {
  if (sector.totalProducts > 0) {
    toast.add({
      severity: 'warn',
      summary: 'El anaquel tiene productos',
      detail: `Elimina o mueve los productos de ${sector.sectorName} antes de borrarlo.`,
      life: 5000,
    })
    return
  }

  confirm.require({
    header: 'Eliminar anaquel',
    message: `¿Eliminar "${sector.sectorName}"? Esta acción no se puede deshacer.`,
    icon: 'pi pi-exclamation-triangle',
    defaultFocus: 'reject',
    rejectProps: { label: 'Cancelar', severity: 'secondary', outlined: true },
    acceptProps: { label: 'Eliminar', icon: 'pi pi-trash', severity: 'danger' },
    accept: () => removeSector(sector),
  })
}

const removeSector = async (sector: SectorList) => {
  try {
    await deleteSector(sector.sectorId)
    toast.add({
      severity: 'success',
      summary: 'Anaquel eliminado',
      detail: `${sector.sectorName} se eliminó.`,
      life: 4000,
    })
    refreshSectors()
  } catch (error) {
    console.error(error)
    toast.add({
      severity: 'error',
      summary: 'No se pudo eliminar',
      detail: getErrorMessage(error),
      life: 5000,
    })
  }
}

onMounted(loadSectors)
</script>
