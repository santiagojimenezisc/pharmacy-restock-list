<template>
    <div class="flex flex-col gap-6">
        <section v-for="{ title, sectors } in groups" v-show="sectors.length" :key="title" class="flex flex-col gap-3">
            <h2 class="text-sm font-semibold text-muted-color">{{ title }}</h2>
            <ul class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <li v-for="sector in sectors" :key="sector.sectorId"
                    :class="{ 'border-dashed': sector.totalProducts === 0 }"
                    class="relative flex items-center gap-3 p-4 rounded-lg border border-surface bg-surface-0 dark:bg-surface-900 hover:bg-emphasis has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-primary">
                    <div class="flex flex-col flex-1 min-w-0 gap-2">
                        <div class="flex items-center justify-between gap-2">
                            <RouterLink :to="{ path: `/sectors/${sector.sectorId}`, query: { name: sector.sectorName } }"
                                class="text-lg font-semibold truncate after:absolute after:inset-0 focus-visible:outline-none">
                                {{ sector.sectorName }}
                            </RouterLink>
                            <Tag v-bind="getStatus(sector)" rounded />
                        </div>
                        <template v-if="sector.totalProducts">
                            <span class="text-muted-color">
                                {{ sector.totalProducts - sector.incompleteProducts }} de {{ sector.totalProducts }} comprados
                            </span>
                            <ProgressBar :value="getProgress(sector)" :showValue="false" class="h-2!" />
                        </template>
                        <Button v-else label="Agregar productos" link class="relative z-10 self-start px-0!"
                            @click="emit('add', sector)" />
                    </div>
                    <i class="pi pi-chevron-right text-muted-color lg:hidden" aria-hidden="true"></i>
                </li>
            </ul>
        </section>
    </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue'
import { Button, ProgressBar, Tag } from 'primevue'
import type { SectorList } from '@/interfaces'

const props = defineProps<{
    sectorsList: SectorList[]
}>()

const emit = defineEmits<{
    add: [sector: SectorList]
}>()

const { sectorsList } = toRefs(props)

const groups = computed(() => [
    {
        title: 'Con pendientes',
        sectors: sectorsList.value.filter((sector) => sector.incompleteProducts > 0)
    },
    {
        title: 'Completos',
        sectors: sectorsList.value.filter((sector) => sector.totalProducts > 0 && sector.incompleteProducts === 0)
    },
    {
        title: 'Sin productos',
        sectors: sectorsList.value.filter((sector) => sector.totalProducts === 0)
    }
])

const getStatus = ({ totalProducts, incompleteProducts }: SectorList) => {
    if (totalProducts === 0) return { value: 'Vacío', severity: 'secondary' }
    if (incompleteProducts === 0) return { value: 'Listo', severity: 'success' }
    return { value: `${incompleteProducts === 1 ? 'Falta' : 'Faltan'} ${incompleteProducts}`, severity: 'warn' }
}

const getProgress = ({ totalProducts, incompleteProducts }: SectorList) =>
    Math.round((totalProducts - incompleteProducts) / totalProducts * 100)
</script>
