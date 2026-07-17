/**
 * EMAIL — envío de los dos correos de cierre por SMTP (Gmail u otro proveedor).
 *
 * Los secretos viven en .env (SMTP_*), SOLO del lado servidor. nodemailer se
 * importa de forma dinámica para no penalizar el arranque del dev server.
 */

/** ¿Están las variables mínimas para enviar correo? (no prueba conexión) */
export function emailConfigStatus(env) {
  const faltan = [
    !env.SMTP_HOST && 'SMTP_HOST',
    !env.SMTP_USER && 'SMTP_USER',
    !env.SMTP_PASSWORD && 'SMTP_PASSWORD',
  ].filter(Boolean)
  if (faltan.length) return { ok: false, motivo: `Faltan variables en .env: ${faltan.join(', ')}` }
  return { ok: true }
}

async function makeTransport(env) {
  const nodemailer = (await import('nodemailer')).default
  const port = Number(env.SMTP_PORT || 465)
  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port,
    secure: port === 465, // 465 = SSL directo · 587 = STARTTLS
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD },
  })
}

/** Prueba la conexión/credenciales SMTP sin enviar nada (para check-setup). */
export async function verifyEmail(env) {
  const st = emailConfigStatus(env)
  if (!st.ok) return st
  const t = await makeTransport(env)
  await t.verify()
  return { ok: true }
}

/** Envía el correo al cliente (cotización) y el interno (presupuesto a David). */
export async function sendCierreEmails(env, { correoCliente, emailCliente, emailEquipo }) {
  const st = emailConfigStatus(env)
  if (!st.ok) return { ok: false, error: st.motivo }
  if (!correoCliente) return { ok: false, error: 'Falta el correo del cliente.' }

  const from = env.EMAIL_FROM || env.SMTP_USER
  const t = await makeTransport(env)

  const r1 = await t.sendMail({
    from,
    to: correoCliente,
    subject: emailCliente.subject,
    text: emailCliente.text,
    html: emailCliente.html, // versión bonita; el text queda de respaldo
  })
  const r2 = await t.sendMail({
    from,
    to: emailEquipo.to,
    cc: emailEquipo.cc || undefined,
    subject: emailEquipo.subject,
    text: emailEquipo.text,
    html: emailEquipo.html,
  })

  return { ok: true, cliente: r1.messageId, equipo: r2.messageId }
}
