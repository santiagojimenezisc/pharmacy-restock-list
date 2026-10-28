<template>
    <Form v-slot="$form" :initialValues="initialValues" :resolver="productFormResolver"
        class="flex flex-col gap-6" @submit="submit">
        <FormField name="isMedicine" class="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <span id="productType">Tipo de producto</span>
            <SelectButton :options="productTypes" optionLabel="label" optionValue="value" :allowEmpty="false"
                aria-labelledby="productType" class="max-sm:w-full max-sm:*:flex-1" />
        </FormField>

        <section class="grid grid-cols-2 sm:grid-cols-6 gap-4">
            <Divider align="left" class="col-span-full my-0!">
                <h3 class="font-semibold">{{ $form.isMedicine?.value ? 'Medicamento' : 'Producto' }}</h3>
            </Divider>

            <FormField v-slot="$field" name="name" class="col-span-2 sm:col-span-6 flex flex-col gap-2">
                <label for="name">Nombre</label>
                <InputText id="name" aria-required="true" placeholder="p. ej. Paracetamol" fluid />
                <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
                    {{ $field.error?.message }}
                </Message>
            </FormField>

            <FormField v-show="$form.isMedicine?.value" name="activeSubstance"
                class="col-span-2 sm:col-span-4 flex flex-col gap-2">
                <label for="activeSubstance">Sustancia activa <span class="text-muted-color">(opcional)</span></label>
                <InputText id="activeSubstance" placeholder="p. ej. Diclofenaco" fluid />
            </FormField>

            <FormField name="grammage" class="col-span-2 flex flex-col gap-2">
                <label for="grammage">Gramaje <span class="text-muted-color">(opcional)</span></label>
                <InputText id="grammage" placeholder="p. ej. 500 mg" fluid />
            </FormField>

            <FormField v-slot="$field" name="laboratoryId" class="col-span-2 sm:col-span-3 flex flex-col gap-2">
                <label for="laboratoryId">Laboratorio</label>
                <Select inputId="laboratoryId" pt:label:aria-required="true" :options="laboratories" optionLabel="name" optionValue="id"
                    placeholder="Selecciona un laboratorio" fluid />
                <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
                    {{ $field.error?.message }}
                </Message>
            </FormField>

            <FormField v-slot="$field" name="description" class="col-span-2 sm:col-span-3 flex flex-col gap-2">
                <label for="description">Presentación</label>
                <InputText id="description" aria-required="true" placeholder="p. ej. Caja con 20 tabletas" fluid />
                <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
                    {{ $field.error?.message }}
                </Message>
            </FormField>
        </section>

        <section class="grid grid-cols-2 sm:grid-cols-6 gap-4">
            <Divider align="left" class="col-span-full my-0!">
                <h3 class="font-semibold">Compra</h3>
            </Divider>

            <FormField v-slot="$field" name="supplierId" class="col-span-2 sm:col-span-6 flex flex-col gap-2">
                <label for="supplierId">Proveedor</label>
                <Select inputId="supplierId" pt:label:aria-required="true" :options="suppliers" optionLabel="name" optionValue="id"
                    placeholder="Selecciona un proveedor" fluid />
                <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
                    {{ $field.error?.message }}
                </Message>
            </FormField>

            <FormField v-slot="$field" name="price" class="sm:col-span-3 flex flex-col gap-2">
                <label for="price">Precio de costo</label>
                <InputNumber inputId="price" pt:pcInputText:root:aria-required="true" mode="currency" currency="MXN" locale="es-MX" :min="0" fluid />
                <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
                    {{ $field.error?.message }}
                </Message>
            </FormField>

            <FormField v-slot="$field" name="quantity" class="sm:col-span-3 flex flex-col gap-2">
                <label for="quantity">Cantidad (pzas)</label>
                <InputNumber inputId="quantity" pt:pcInputText:root:aria-required="true" :min="1" showButtons buttonLayout="horizontal"
                    incrementIcon="pi pi-plus" decrementIcon="pi pi-minus"
                    inputClass="text-center" fluid />
                <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
                    {{ $field.error?.message }}
                </Message>
            </FormField>
        </section>

        <section class="grid grid-cols-2 sm:grid-cols-6 gap-4">
            <Divider align="left" class="col-span-full my-0!">
                <h3 class="font-semibold">Ubicación</h3>
            </Divider>

            <FormField v-slot="$field" name="sectorId" class="col-span-2 sm:col-span-6 flex flex-col gap-2">
                <label for="sectorId">Anaquel</label>
                <Select inputId="sectorId" pt:label:aria-required="true" :options="sectors" optionLabel="name" optionValue="id"
                    placeholder="Selecciona un anaquel" fluid />
                <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
                    {{ $field.error?.message }}
                </Message>
                <small v-else-if="!product && $field?.value === sectorId" class="text-muted-color">
                    Es el anaquel que tenías abierto.
                </small>
            </FormField>

            <Button :label="showDetails ? 'Ocultar detalles opcionales' : 'Más detalles (opcional)'"
                :icon="showDetails ? 'pi pi-chevron-up' : 'pi pi-chevron-down'" iconPos="right" link
                class="col-span-full justify-self-start px-0!" :aria-expanded="showDetails"
                @click="showDetails = !showDetails" />

            <FormField v-show="showDetails" name="category" class="col-span-2 sm:col-span-3 flex flex-col gap-2">
                <label for="category">Categoría</label>
                <InputText id="category" placeholder="p. ej. Analgésicos" fluid />
            </FormField>

            <FormField v-show="showDetails" name="tags" class="col-span-2 sm:col-span-3 flex flex-col gap-2">
                <label for="tags">Etiquetas</label>
                <InputText id="tags" placeholder="p. ej. dolor, fiebre" fluid />
            </FormField>
        </section>

        <div
            class="sticky -bottom-5 z-10 -mx-5 -mb-5 px-5 py-4 flex flex-col gap-3 border-t border-surface bg-surface-0 dark:bg-surface-900 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex items-center justify-between sm:flex-col sm:items-start">
                <span class="text-sm text-muted-color">Total de la compra</span>
                <span class="text-2xl font-semibold">
                    {{ formatCurrency(($form.price?.value ?? 0) * ($form.quantity?.value ?? 0)) }}
                </span>
            </div>
            <div class="flex gap-2">
                <Button label="Cancelar" text severity="secondary" class="max-sm:hidden!" @click="emit('cancel')" />
                <Button type="submit" :label="product ? 'Guardar cambios' : 'Agregar producto'"
                    :icon="product ? 'pi pi-check' : 'pi pi-plus'" :loading="isSaving" class="max-sm:w-full" />
            </div>
        </div>
    </Form>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Form, FormField, type FormSubmitEvent } from '@primevue/forms'
import { Button, Divider, InputNumber, InputText, Message, Select, SelectButton } from 'primevue'
import { useToast } from 'primevue/usetoast'
import { formatCurrency } from '@/helpers/commons'
import {
    REQUIRED_FIELDS,
    emptyForm,
    formToProduct,
    productFormResolver,
    productToForm,
    type ProductFormValues
} from '@/helpers/productForm'
import type { CatalogItem, Product } from '@/interfaces'
import { getLaboratories, getSectors, getSuppliers } from '@/services/catalogs'
import { createProduct, updateProduct } from '@/services/products'

const props = defineProps<{
    product: Product | null
    sectorId: number
}>()

const emit = defineEmits<{
    saved: []
    cancel: []
}>()

const productTypes = [
    { label: 'Medicamento', value: true },
    { label: 'Otro producto', value: false }
]

const initialValues = props.product ? productToForm(props.product) : emptyForm(props.sectorId)
const showDetails = ref(Boolean(initialValues.category || initialValues.tags))
const laboratories = ref<CatalogItem[]>([])
const suppliers = ref<CatalogItem[]>([])
const sectors = ref<CatalogItem[]>([])
const isSaving = ref(false)
const toast = useToast()

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

const submit = async ({ valid, values, states }: FormSubmitEvent) => {
    if (!valid) {
        const firstInvalid = REQUIRED_FIELDS.find((field) => states[field]?.invalid)
        if (firstInvalid) document.getElementById(firstInvalid)?.focus()
        return
    }
    if (isSaving.value) return

    const product = formToProduct(values as ProductFormValues)
    isSaving.value = true
    try {
        if (props.product) {
            await updateProduct(props.product.id, product)
        } else {
            await createProduct(product)
        }
        toast.add({
            severity: 'success',
            summary: props.product ? 'Producto actualizado' : 'Producto agregado',
            detail: `${product.name} se guardó correctamente.`,
            life: 4000
        })
        emit('saved')
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
