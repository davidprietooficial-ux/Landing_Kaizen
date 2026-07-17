/**
 * CHULETA DE OBJECIONES — panel de dudas offline y buscable (capa interna).
 *
 * ESTADO: Etapa 1 = solo TIPO + arreglo vacio. Se llena desde la documentacion
 * del proyecto (Master Context + Catalogo + Brand) en la Etapa 5.
 */

export interface Objecion {
  id: string
  /** Lo que dice/pregunta el cliente. */
  objecion: string
  /** Respuesta sugerida para David, en la voz de marca. */
  respuesta: string
  /** Palabras clave para el buscador instantaneo. */
  tags: string[]
}

// TODO(etapa-5): poblar (precio alto, garantia de ventas, por que factura,
// crudos, pagos 50/50, etc.).
export const OBJECIONES: Objecion[] = []
