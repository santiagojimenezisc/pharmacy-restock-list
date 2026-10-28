<template>
  <Dialog
    v-model:visible="visible"
    header="Agregar anaquel"
    modal
    :style="{ width: '30rem' }"
    :breakpoints="{ '640px': '100vw' }"
  >
    <Form
      :initialValues="{ name: '', description: '' }"
      :resolver="resolver"
      class="flex flex-col gap-4"
      @submit="submit"
    >
      <FormField v-slot="$field" name="name" class="flex flex-col gap-2">
        <label for="sectorName">Nombre</label>
        <InputText id="sectorName" aria-required="true" placeholder="p. ej. Refrigerador" fluid />
        <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
          {{ $field.error?.message }}
        </Message>
      </FormField>

      <FormField name="description" class="flex flex-col gap-2">
        <label for="sectorDescription"
          >Descripción <span class="text-muted-color">(opcional)</span></label
        >
        <InputText id="sectorDescription" placeholder="p. ej. Junto a la caja" fluid />
      </FormField>

      <div class="flex justify-end gap-2">
        <Button label="Cancelar" text severity="secondary" @click="visible = false" />
        <Button type="submit" label="Crear anaquel" icon="pi pi-plus" :loading="isSaving" />
      </div>
    </Form>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Form, FormField, type FormResolverOptions, type FormSubmitEvent } from '@primevue/forms'
import { Button, Dialog, InputText, Message } from 'primevue'
import { useToast } from 'primevue/usetoast'
import { getErrorMessage, isNameTaken } from '@/helpers/commons'
import { createSector } from '@/services/sectors'

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  existingNames: string[]
}>()

const emit = defineEmits<{
  created: [id: number, name: string]
}>()

const isSaving = ref(false)
const toast = useToast()

const resolver = ({ values }: FormResolverOptions) => {
  const name: string = values.name ?? ''
  const errors: Record<string, { message: string }[]> = {}

  if (!name.trim()) {
    errors.name = [{ message: 'Escribe el nombre' }]
  } else if (isNameTaken(name, props.existingNames)) {
    errors.name = [{ message: 'Ya existe un anaquel con ese nombre' }]
  }

  return { values, errors }
}

const submit = async ({ valid, values }: FormSubmitEvent) => {
  if (!valid) {
    document.getElementById('sectorName')?.focus()
    return
  }
  if (isSaving.value) return

  const name = values.name.trim()
  isSaving.value = true
  try {
    const { id } = await createSector({ name, description: values.description.trim() })
    toast.add({
      severity: 'success',
      summary: 'Anaquel creado',
      detail: `${name} está listo para agregarle productos.`,
      life: 4000,
    })
    visible.value = false
    emit('created', id, name)
  } catch (error) {
    console.error(error)
    toast.add({
      severity: 'error',
      summary: 'No se pudo crear',
      detail: getErrorMessage(error),
      life: 5000,
    })
  } finally {
    isSaving.value = false
  }
}
</script>
