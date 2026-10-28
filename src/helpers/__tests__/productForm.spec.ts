import { describe, expect, it } from 'vitest'
import {
  emptyForm,
  formToProduct,
  productFormResolver,
  productToForm,
  type ProductFormValues,
} from '@/helpers/productForm'
import type { Product } from '@/interfaces'

const validForm: ProductFormValues = {
  ...emptyForm(2),
  name: ' Nediclon ',
  description: 'Caja con 20 tabletas',
  laboratoryId: 1,
  supplierId: 3,
  price: 8.8,
  quantity: 5,
}

const resolve = (values: ProductFormValues) => productFormResolver({ values, names: undefined })

describe('emptyForm', () => {
  it('empieza como medicamento, con 1 pieza y el anaquel abierto', () => {
    expect(emptyForm(4)).toMatchObject({ isMedicine: true, quantity: 1, sectorId: 4 })
  })
})

describe('productFormResolver', () => {
  it('marca los obligatorios vacíos en el orden de la pantalla', () => {
    expect(Object.keys(resolve(emptyForm(2)).errors)).toEqual([
      'name',
      'laboratoryId',
      'description',
      'supplierId',
      'price',
    ])
  })

  it('no marca errores en un formulario completo', () => {
    expect(resolve(validForm).errors).toEqual({})
  })

  it('trata un nombre de puros espacios como vacío', () => {
    expect(resolve({ ...validForm, name: '   ' }).errors.name).toEqual([
      { message: 'Escribe el nombre' },
    ])
  })
})

describe('formToProduct', () => {
  it('limpia los textos y convierte las etiquetas en lista', () => {
    const product = formToProduct({ ...validForm, tags: 'dolor, , fiebre ' })

    expect(product.name).toBe('Nediclon')
    expect(product.tags).toEqual(['dolor', 'fiebre'])
  })

  it('quita la sustancia activa si no es medicamento', () => {
    const product = formToProduct({
      ...validForm,
      isMedicine: false,
      activeSubstance: 'Diclofenaco',
    })

    expect(product.activeSubstance).toBe('')
  })
})

describe('productToForm', () => {
  it('convierte las etiquetas en texto separado por comas', () => {
    const product = { ...validForm, id: 1, tags: ['dolor', 'fiebre'] } as unknown as Product

    expect(productToForm(product).tags).toBe('dolor, fiebre')
  })
})
