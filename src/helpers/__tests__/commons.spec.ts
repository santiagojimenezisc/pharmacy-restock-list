import { describe, expect, it } from 'vitest'
import {
  formatCurrency,
  getErrorMessage,
  getInitials,
  isNameTaken,
  normalizeText,
} from '@/helpers/commons'

describe('getInitials', () => {
  it('toma la primera letra de las dos primeras palabras', () => {
    expect(getInitials('Farmacéutica del Centro')).toBe('FD')
  })

  it('ignora espacios de más', () => {
    expect(getInitials('  dimen   tultitlán ')).toBe('DT')
  })

  it('funciona con una sola palabra', () => {
    expect(getInitials('Otro')).toBe('O')
  })
})

describe('normalizeText', () => {
  it('quita acentos, mayúsculas y espacios de las orillas', () => {
    expect(normalizeText('  Ácido Fólico ')).toBe('acido folico')
  })
})

describe('isNameTaken', () => {
  const names = ['Anaquel 1', 'Refrigeración']

  it('detecta el mismo nombre aunque cambien mayúsculas o acentos', () => {
    expect(isNameTaken('anaquel 1', names)).toBe(true)
    expect(isNameTaken('REFRIGERACION', names)).toBe(true)
  })

  it('no confunde nombres parecidos', () => {
    expect(isNameTaken('Anaquel 10', names)).toBe(false)
  })
})

describe('getErrorMessage', () => {
  it('usa el mensaje que manda el API', () => {
    expect(getErrorMessage(new Error('Ya existe un anaquel con ese nombre'))).toBe(
      'Ya existe un anaquel con ese nombre',
    )
  })

  it('pide revisar la conexión cuando fetch no llega al servidor', () => {
    expect(getErrorMessage(new TypeError('Failed to fetch'))).toBe(
      'Revisa tu conexión e inténtalo de nuevo.',
    )
  })

  it('pide revisar la conexión si lo que llega no es un error', () => {
    expect(getErrorMessage('algo raro')).toBe('Revisa tu conexión e inténtalo de nuevo.')
  })
})

describe('formatCurrency', () => {
  it('da formato de pesos mexicanos con dos decimales', () => {
    expect(formatCurrency(1234.5)).toBe('$1,234.50')
  })
})
