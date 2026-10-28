import type { FormResolverOptions } from '@primevue/forms'
import type { NewProduct, Product } from '@/interfaces'

export type ProductFormValues = Omit<
  NewProduct,
  'quantity' | 'price' | 'laboratoryId' | 'supplierId' | 'sectorId' | 'tags'
> & {
  quantity: number | null
  price: number | null
  laboratoryId: number | null
  supplierId: number | null
  sectorId: number | null
  tags: string
}

// En el orden en que aparecen en pantalla, para llevar el foco al primer error
export const REQUIRED_FIELDS = [
  'name',
  'laboratoryId',
  'description',
  'supplierId',
  'price',
  'quantity',
  'sectorId',
] as const

type RequiredField = (typeof REQUIRED_FIELDS)[number]

const ERROR_MESSAGES: Record<RequiredField, string> = {
  name: 'Escribe el nombre',
  laboratoryId: 'Elige un laboratorio',
  description: 'Escribe la presentación',
  supplierId: 'Elige un proveedor',
  price: 'Escribe el precio de costo',
  quantity: 'La cantidad debe ser al menos 1',
  sectorId: 'Elige un anaquel',
}

export const emptyForm = (sectorId: number | null = null): ProductFormValues => ({
  name: '',
  activeSubstance: '',
  description: '',
  quantity: 1,
  grammage: '',
  price: null,
  laboratoryId: null,
  supplierId: null,
  sectorId,
  category: '',
  tags: '',
  isMedicine: true,
})

export const productToForm = (product: Product): ProductFormValues => ({
  name: product.name,
  activeSubstance: product.activeSubstance,
  description: product.description,
  quantity: product.quantity,
  grammage: product.grammage,
  price: product.price,
  laboratoryId: product.laboratoryId,
  supplierId: product.supplierId,
  sectorId: product.sectorId,
  category: product.category,
  tags: Array.isArray(product.tags) ? product.tags.join(', ') : '',
  isMedicine: product.isMedicine,
})

export const productFormResolver = ({ values }: FormResolverOptions) => {
  const errors: Partial<Record<RequiredField, { message: string }[]>> = {}

  for (const field of REQUIRED_FIELDS) {
    const value = values[field]
    const isEmpty = typeof value === 'string' ? !value.trim() : !value
    if (isEmpty) errors[field] = [{ message: ERROR_MESSAGES[field] }]
  }

  return { values, errors }
}

// Solo se llama con un formulario válido: el resolver ya revisó los campos obligatorios
export const formToProduct = (values: ProductFormValues): NewProduct => ({
  ...values,
  name: values.name.trim(),
  description: values.description.trim(),
  activeSubstance: values.isMedicine ? values.activeSubstance.trim() : '',
  tags: values.tags
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean),
  quantity: values.quantity as number,
  price: values.price as number,
  laboratoryId: values.laboratoryId as number,
  supplierId: values.supplierId as number,
  sectorId: values.sectorId as number,
})
