const toDate = (value) => {
  if (!value) return null

  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

const isExpirationDateInPast = (expirationDate, now = new Date()) => {
  const expiration = toDate(expirationDate)
  const current = toDate(now)

  if (!expiration || !current) return false

  return expiration < current
}

export {
  isExpirationDateInPast,
}
