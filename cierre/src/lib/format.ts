/** Utilidades de formato. Sin dependencias. */

/** Formatea un monto en pesos colombianos: 1900000 -> "$1.900.000". */
export function cop(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(Math.round(amount))
}

/** Formatea una fraccion como porcentaje: 0.205 -> "20,5%". */
export function pct(fraction: number, decimals = 1): string {
  return `${(fraction * 100).toFixed(decimals).replace('.', ',')}%`
}
