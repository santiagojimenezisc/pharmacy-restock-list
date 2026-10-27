<template>
    <RouterLink v-for="{ incompleteProducts, sectorId, sectorName, totalProducts } in sectorsList" :key="sectorId"
        :to="{ path: `/sectors/${sectorId}`, query: { name: sectorName } }"
        class="flex flex-col gap-4 my-8 px-6 py-3 rounded border border-surface bg-surface-0 dark:bg-surface-900 hover:bg-emphasis focus-visible:outline-2 focus-visible:outline-primary">
        <div class="flex items-center justify-between text-lg">
            <p>{{ sectorName }}</p>
            <p>{{ totalProducts - incompleteProducts }} / {{ totalProducts }}</p>
        </div>
        <ProgressBar
            :value="Number((((totalProducts - incompleteProducts) / totalProducts * 100).toFixed(1)) || 0)" />
    </RouterLink>
</template>
<script setup lang="ts">
import { toRefs } from 'vue'
import type { SectorList } from '@/interfaces';
import ProgressBar from 'primevue/progressbar';

const props = defineProps<{
    sectorsList: SectorList[]
}>()

const { sectorsList } = toRefs(props)
</script>
