/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  EMPRESA — datos fiscales, bancarios y de cierre de Kaizen Studios
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  Fuente única de los datos que aparecen en los correos de cierre (cotización al
 *  cliente + presupuesto interno). Hoy son PLACEHOLDERS de modo previo: David los
 *  reemplaza por los reales una sola vez aquí y se reflejan en todas las vistas.
 *
 *  ⚠️ DAVID: reemplaza los campos marcados con ⚠️ por los datos reales antes de
 *  conectar el envío de verdad (Etapa 4D).
 */

export interface CuentaBancaria {
  banco: string
  tipo: 'Ahorros' | 'Corriente'
  numero: string
  titular: string
}

export const EMPRESA = {
  /** Razón social (la del NIT, para la factura/contrato). */
  razonSocial: 'MIRAI GROUP COLOMBIA S.A.S.',
  /** Marca comercial (la que ve el cliente). */
  marca: 'Kaizen Studios',
  /** NIT con dígito de verificación. El DV (-2) lo calculé con el algoritmo DIAN
   *  sobre 901.982.324; David: confirma que coincide con el RUT. */
  nit: '901.982.324-2',
  /** Correo a donde llega el PRESUPUESTO interno al cerrar. */
  correoInterno: 'davidprieto.oficial@gmail.com',
  /** Copia (CC) del presupuesto interno. */
  correoInternoCC: 'kaisenpoststudio@gmail.com',
  /** Correo desde el que sale la cotización al cliente. */
  correoRemitente: 'kaisenpoststudio@gmail.com',
  /** Teléfono / WhatsApp de contacto (pie del correo al cliente). */
  contacto: '+57 319 457 5065',

  /** Anticipo para arrancar (fracción del total con IVA). */
  anticipoPct: 0.5,
  /** Nota legal del anticipo (se muestra al cliente). */
  anticipoNota: 'No reembolsable (según cláusulas del contrato).',
  /** Cuándo se paga el saldo restante. */
  saldoTexto: 'contra entrega del material final',
  /** Vigencia de la cotización en días. */
  validezDias: 15,

  /** Cuentas a las que el cliente abona el anticipo. */
  cuentas: [
    {
      banco: 'Bancolombia',
      tipo: 'Ahorros',
      numero: '24400004450',
      titular: 'MIRAI GROUP COLOMBIA S.A.S.',
    },
  ] as CuentaBancaria[],
} as const

export type EmpresaConfig = typeof EMPRESA
