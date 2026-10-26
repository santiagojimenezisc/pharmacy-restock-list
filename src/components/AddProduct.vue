<template>
    <form class="flex flex-col gap-6" @submit.prevent="submit">
        <div class="flex items-center gap-3">
            <label for="isMedicine">¿Es medicamento?</label>
            <ToggleSwitch v-model="form.isMedicine" inputId="isMedicine" />
            <span>{{ form.isMedicine ? 'Sí' : 'No' }}</span>
        </div>

        <section class="flex flex-col gap-4">
            <h3 class="text-sm font-semibold uppercase text-surface-400">
                Datos del {{ form.isMedicine ? 'medicamento' : 'producto' }}
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="flex flex-col gap-2">
                    <label for="name">Nombre</label>
                    <InputText id="name" v-model="form.name" placeholder="p. ej. Paracetamol" fluid />
                </div>

                <div v-if="form.isMedicine" class="flex flex-col gap-2">
                    <label for="activeSubstance">Sustancia activa <span class="text-surface-400">(opcional)</span></label>
                    <InputText id="activeSubstance" v-model="form.activeSubstance" fluid />
                </div>

                <div class="flex flex-col gap-2">
                    <label for="grammage">Gramaje <span class="text-surface-400">(opcional)</span></label>
                    <InputText id="grammage" v-model="form.grammage" placeholder="p. ej. 500 mg" fluid />
                </div>

                <div class="flex flex-col gap-2">
                    <label for="laboratory">Laboratorio</label>
                    <Select v-model="form.laboratoryId" inputId="laboratory" :options="laboratories" optionLabel="name"
                        optionValue="id" placeholder="Selecciona un laboratorio" fluid />
                </div>

                <div class="flex flex-col gap-2 sm:col-span-2">
                    <label for="description">Descripción</label>
                    <Textarea id="description" v-model="form.description" rows="1" autoResize
                        placeholder="p. ej. Caja con 20 tabletas" fluid />
                </div>
            </div>
        </section>

        <section class="flex flex-col gap-4">
            <h3 class="text-sm font-semibold uppercase text-surface-400">Compra</h3>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="flex flex-col gap-2">
                    <label for="supplier">Proveedor</label>
                    <Select v-model="form.supplierId" inputId="supplier" :options="suppliers" optionLabel="name"
                        optionValue="id" placeholder="Selecciona un proveedor" fluid />
                </div>

                <div class="flex flex-col gap-2">
                    <label for="price">Precio de costo</label>
                    <InputNumber v-model="form.price" inputId="price" mode="currency" currency="MXN" locale="es-MX"
                        :min="0" fluid />
                </div>

                <div class="flex flex-col gap-2">
                    <label for="quantity">Cantidad</label>
                    <InputNumber v-model="form.quantity" inputId="quantity" :min="1" suffix=" pzas" fluid />
                </div>
            </div>
            <p class="text-right">Total: <b>{{ formatCurrency((form.quantity ?? 0) * (form.price ?? 0)) }}</b></p>
        </section>

        <section class="flex flex-col gap-4">
            <h3 class="text-sm font-semibold uppercase text-surface-400">Ubicación</h3>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="flex flex-col gap-2">
                    <label for="sector">Anaquel</label>
                    <Select v-model="form.sectorId" inputId="sector" :options="sectors" optionLabel="name"
                        optionValue="id" placeholder="Selecciona un anaquel" fluid />
                </div>

                <div class="flex flex-col gap-2">
                    <label for="category">Categoría <span class="text-surface-400">(opcional)</span></label>
                    <InputText id="category" v-model="form.category" placeholder="p. ej. Analgésicos" fluid />
                </div>

                <div class="flex flex-col gap-2">
                    <label for="tags">Etiquetas <span class="text-surface-400">(opcional)</span></label>
                    <InputText id="tags" v-model="form.tags" placeholder="p. ej. dolor, fiebre" fluid />
                </div>
            </div>
        </section>

        <div class="flex justify-end">
            <Button type="submit" label="Agregar producto" icon="pi pi-plus" :disabled="!newProduct"
                :loading="isSaving" />
        </div>
    </form>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Button, InputNumber, InputText, Select, Textarea, ToggleSwitch } from 'primevue'
import { useToast } from 'primevue/usetoast'
import { formatCurrency } from '@/helpers/commons'
import type { CatalogItem, NewProduct } from '@/interfaces'
import { getLaboratories, getSectors, getSuppliers } from '@/services/catalogs'
import { createProduct } from '@/services/products'

// Los campos numéricos y los selects empiezan vacíos (null) hasta que el usuario elige;
// las etiquetas se escriben como texto separado por comas
type ProductForm = Omit<NewProduct, 'quantity' | 'price' | 'laboratoryId' | 'supplierId' | 'sectorId' | 'tags'> & {
    quantity: number | null
    price: number | null
    laboratoryId: number | null
    supplierId: number | null
    sectorId: number | null
    tags: string
}

const emptyForm = (): ProductForm => ({
    name: '',
    activeSubstance: '',
    description: '',
    quantity: null,
    grammage: '',
    price: null,
    laboratoryId: null,
    supplierId: null,
    sectorId: null,
    category: '',
    tags: '',
    isMedicine: true
})

const laboratories = ref<CatalogItem[]>([])
const suppliers = ref<CatalogItem[]>([])
const sectors = ref<CatalogItem[]>([])

const emit = defineEmits<{ created: [] }>()

const form = ref<ProductForm>(emptyForm())
const isSaving = ref(false)
const toast = useToast()

// Los tres catálogos no dependen entre sí, así que se piden al mismo tiempo
const loadCatalogs = async () => {
    try {
        const [laboratoryList, supplierList, sectorList] = await Promise.all([
            getLaboratories(),
            getSuppliers(),
            getSectors()
        ])
        laboratories.value = laboratoryList.filter((item) => item.active)
        suppliers.value = supplierList.filter((item) => item.active)
        sectors.value = sectorList.filter((item) => item.active)
    } catch (error) {
        console.error(error)
        toast.add({
            severity: 'error',
            summary: 'No se pudieron cargar las opciones',
            detail: 'Cierra y vuelve a abrir el formulario para intentarlo de nuevo.',
            life: 5000
        })
    }
}

onMounted(loadCatalogs)

// null mientras falte un campo obligatorio; así el botón se desactiva solo
const newProduct = computed<NewProduct | null>(() => {
    const { quantity, price, laboratoryId, supplierId, sectorId, ...rest } = form.value
    if (!rest.name.trim() || !rest.description.trim()) return null
    if (!quantity || !price || !laboratoryId || !supplierId || !sectorId) return null

    return {
        ...rest,
        name: rest.name.trim(),
        activeSubstance: rest.isMedicine ? rest.activeSubstance : '',
        tags: rest.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        quantity,
        price,
        laboratoryId,
        supplierId,
        sectorId
    }
})

const submit = async () => {
    const product = newProduct.value
    if (!product || isSaving.value) return

    isSaving.value = true
    try {
        await createProduct(product)
        toast.add({
            severity: 'success',
            summary: 'Producto agregado',
            detail: `${product.name} se guardó correctamente.`,
            life: 4000
        })
        form.value = emptyForm()
        emit('created')
    } catch (error) {
        console.error(error)
        toast.add({
            severity: 'error',
            summary: 'No se pudo guardar',
            detail: 'Revisa tu conexión e inténtalo de nuevo.',
            life: 5000
        })
    } finally {
        isSaving.value = false
    }
}
</script>
