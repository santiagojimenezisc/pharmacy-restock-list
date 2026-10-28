<template>
    <div class="flex flex-col gap-6">
        <section v-for="{ title, sectors } in groups" v-show="sectors.length" :key="title" class="flex flex-col gap-3">
            <h2 class="text-sm font-semibold text-muted-color">{{ title }}</h2>
            <ul class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <li v-for="sector in sectors" :key="sector.sectorId"
                    :class="{ 'border-dashed': sector.totalProducts === 0 }"
                    class="group relative flex flex-col gap-2 p-4 rounded-lg border border-surface bg-surface-0 dark:bg-surface-900 hover:bg-emphasis has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-primary">
                    <div class="flex items-center gap-2">
                        <InputText v-if="editingId === sector.sectorId" v-model="editingName" v-focus
                            :aria-label="`Nuevo nombre de ${sector.sectorName}`" size="small"
                            class="relative z-10 flex-1 min-w-0" @keydown.enter="saveRename(sector)"
                            @keydown.esc="editingId = null" @blur="saveRename(sector)" />
                        <template v-else>
                            <RouterLink
                                :to="{ path: `/sectors/${sector.sectorId}`, query: { name: sector.sectorName } }"
                                class="text-lg font-semibold truncate after:absolute after:inset-0 focus-visible:outline-none">
                                {{ sector.sectorName }}
                            </RouterLink>
                            <Button icon="pi pi-pencil" text rounded size="small" severity="secondary"
                                :aria-label="`Cambiar nombre de ${sector.sectorName}`"
                                class="relative z-10 shrink-0 lg:opacity-0 lg:group-hover:opacity-100 lg:focus-visible:opacity-100"
                                @click="startRename(sector)" />
                        </template>
                        <Tag v-bind="getStatus(sector)" rounded class="ml-auto shrink-0" />
                        <Button icon="pi pi-ellipsis-v" text rounded severity="secondary"
                            :aria-label="`Opciones de ${sector.sectorName}`" aria-haspopup="true"
                            aria-controls="sector-menu" class="relative z-10 shrink-0"
                            @click="openMenu($event, sector)" />
                    </div>
                    <template v-if="sector.totalProducts">
                        <span class="text-muted-color">
                            {{ sector.totalProducts - sector.incompleteProducts }} de {{ sector.totalProducts }} comprados
                        </span>
                        <ProgressBar :value="getProgress(sector)" :showValue="false" class="h-2!" />
                    </template>
                    <Button v-else label="Agregar productos" link class="relative z-10 self-start px-0!"
                        @click="emit('add', sector)" />
                </li>
            </ul>
        </section>
        <Menu ref="menu" id="sector-menu" :model="menuItems" popup />
    </div>
</template>

<script setup lang="ts">
import { computed, ref, toRefs, useTemplateRef, type Directive } from 'vue'
import { Button, InputText, Menu, ProgressBar, Tag } from 'primevue'
import type { MenuItem } from 'primevue/menuitem'
import type { SectorList } from '@/interfaces'

const props = defineProps<{
    sectorsList: SectorList[]
}>()

const emit = defineEmits<{
    add: [sector: SectorList]
    rename: [sector: SectorList, name: string]
    delete: [sector: SectorList]
}>()

const { sectorsList } = toRefs(props)
const menu = useTemplateRef<InstanceType<typeof Menu>>('menu')
const selectedSector = ref<SectorList | null>(null)
const editingId = ref<number | null>(null)
const editingName = ref('')

const vFocus: Directive<HTMLElement> = {
    mounted: (element) => element.focus()
}

const menuItems: MenuItem[] = [
    {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        class: '**:text-red-600! dark:**:text-red-400!',
        command: () => {
            if (selectedSector.value) emit('delete', selectedSector.value)
        }
    }
]

const openMenu = (event: Event, sector: SectorList) => {
    selectedSector.value = sector
    menu.value?.toggle(event)
}

const startRename = (sector: SectorList) => {
    editingId.value = sector.sectorId
    editingName.value = sector.sectorName
}

const saveRename = (sector: SectorList) => {
    if (editingId.value !== sector.sectorId) return
    editingId.value = null

    const name = editingName.value.trim()
    if (name && name !== sector.sectorName) emit('rename', sector, name)
}

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
