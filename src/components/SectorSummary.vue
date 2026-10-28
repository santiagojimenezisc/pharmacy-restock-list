<template>
    <section class="flex flex-col gap-4 p-4 rounded-lg border border-surface bg-surface-0 dark:bg-surface-900">
        <h2 class="uppercase font-mono text-xs text-muted-color max-xl:hidden">Resumen del anaquel</h2>

        <div>
            <div class="text-orange-600 dark:text-orange-400">Por comprar</div>
            <div class="text-3xl font-semibold">{{ formatCurrency(totalPending) }}</div>
            <div class="text-muted-color">
                {{ pendingProducts.length }} {{ pendingProducts.length === 1 ? 'producto pendiente' : 'productos pendientes' }}
            </div>
        </div>

        <div>
            <ProgressBar :value="percentComplete" :showValue="false" class="h-2!" />
            <div class="flex justify-between mt-1 text-sm text-muted-color">
                <span>{{ percentComplete }}% comprado</span>
                <span>{{ products.length - pendingProducts.length }} de {{ products.length }} productos</span>
            </div>
        </div>

        <Button label="Ver desglose" :icon="showBreakdown ? 'pi pi-chevron-up' : 'pi pi-chevron-down'" iconPos="right"
            text class="w-full xl:hidden!" :aria-expanded="showBreakdown" @click="showBreakdown = !showBreakdown" />

        <div :class="showBreakdown ? 'flex' : 'hidden xl:flex'" class="flex-col gap-4">
            <dl class="grid grid-cols-3 gap-2 xl:grid-cols-1 xl:gap-0 xl:rounded-lg xl:overflow-hidden">
                <div v-for="{ label, amount, colors } in totals" :key="label" :class="colors"
                    class="flex flex-col p-2 rounded-lg xl:flex-row xl:items-center xl:justify-between xl:p-3 xl:rounded-none">
                    <dt class="text-sm xl:text-base">{{ label }}</dt>
                    <dd class="font-semibold">{{ formatCurrency(amount) }}</dd>
                </div>
            </dl>

            <div class="flex flex-col gap-3">
                <h3 class="uppercase font-mono text-xs text-muted-color">Pendiente por proveedor</h3>
                <ul class="flex flex-col gap-3">
                    <li v-for="{ name, pending, amount } in suppliers" :key="name"
                        class="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
                        <Avatar :label="getInitials(name)" shape="circle" />
                        <div class="flex flex-col">
                            <span class="text-sm truncate">{{ name }}</span>
                            <span class="text-xs text-muted-color">
                                {{ pending === 0 ? 'Todo comprado' : `${pending} ${pending === 1 ? 'producto pendiente' : 'productos pendientes'}` }}
                            </span>
                        </div>
                        <span v-if="pending" class="font-semibold text-orange-600 dark:text-orange-400">
                            {{ formatCurrency(amount) }}
                        </span>
                        <span v-else class="text-primary">Listo</span>
                    </li>
                </ul>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Avatar, Button, ProgressBar } from 'primevue'
import { formatCurrency, getInitials } from '@/helpers/commons'
import type { Product } from '@/interfaces'

const props = defineProps<{
    products: Product[]
}>()

const showBreakdown = ref(false)

const subtotal = (product: Product) => product.price * product.quantity

const pendingProducts = computed(() => props.products.filter((product) => !product.isComplete))

const totalPending = computed(() => pendingProducts.value.reduce((total, product) => total + subtotal(product), 0))

const totalAmount = computed(() => props.products.reduce((total, product) => total + subtotal(product), 0))

const totalComplete = computed(() => totalAmount.value - totalPending.value)

const percentComplete = computed(() =>
    totalAmount.value ? Math.round(totalComplete.value / totalAmount.value * 100) : 0
)

const totals = computed(() => [
    {
        label: 'Comprado',
        amount: totalComplete.value,
        colors: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-400 dark:text-emerald-950'
    },
    {
        label: 'Por comprar',
        amount: totalPending.value,
        colors: 'bg-orange-100 text-orange-900 dark:bg-orange-400 dark:text-orange-950'
    },
    {
        label: 'Total del anaquel',
        amount: totalAmount.value,
        colors: 'bg-blue-100 text-blue-900 dark:bg-blue-500 dark:text-white'
    }
])

const suppliers = computed(() => {
    const groups = new Map<string, { name: string, pending: number, amount: number }>()

    for (const product of props.products) {
        const name = product.supplierName || 'Otro'
        const group = groups.get(name) ?? { name, pending: 0, amount: 0 }
        if (!product.isComplete) {
            group.pending++
            group.amount += subtotal(product)
        }
        groups.set(name, group)
    }

    return [...groups.values()].sort((a, b) => b.amount - a.amount)
})
</script>
