<template>
    <Dialog v-model:visible="visible" modal :style="{ width: '50rem' }" :breakpoints="{ '640px': '100vw' }"
        class="max-sm:h-dvh! max-sm:max-h-dvh! max-sm:rounded-none!" pt:content:class="overflow-x-hidden">
        <template #header>
            <div class="flex flex-col">
                <span class="text-xl font-semibold">{{ product ? 'Editar producto' : 'Agregar producto' }}</span>
                <span v-if="subtitle" class="text-sm text-muted-color">{{ subtitle }}</span>
            </div>
        </template>
        <ProductForm :product="product" :sectorId="sectorId" @saved="onSaved" @cancel="visible = false" />
    </Dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Dialog } from 'primevue'
import ProductForm from '@/components/ProductForm.vue'
import type { Product } from '@/interfaces'

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
    product: Product | null
    sectorId: number | null
    sectorName?: string
}>()

const emit = defineEmits<{
    saved: []
}>()

const subtitle = computed(() => {
    if (props.product) return `${props.product.name} · ${props.product.sectorName}`
    return props.sectorName ? `Se agregará a ${props.sectorName}` : ''
})

const onSaved = () => {
    visible.value = false
    emit('saved')
}
</script>
