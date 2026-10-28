const currencyFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
})

export const getInitials = (name: string) => {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('')
}

export const normalizeText = (text: string) => {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

export const isNameTaken = (name: string, names: string[]) => {
  return names.some((existing) => normalizeText(existing) === normalizeText(name))
}

export const getErrorMessage = (error: unknown) => {
  return error instanceof Error && !(error instanceof TypeError)
    ? error.message
    : 'Revisa tu conexión e inténtalo de nuevo.'
}

export const formatCurrency = (amount: number) => {
  return currencyFormatter.format(amount)
}
