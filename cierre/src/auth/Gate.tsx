import { useState, type ReactNode, type FormEvent, type CSSProperties } from 'react'

/**
 * LOGIN SIMPLE (capa extra, del lado del código).
 *
 * Corre en el navegador, así que funciona en CUALQUIER hosting (Hostinger, Vercel,
 * el otro sitio Node.js). ⚠️ NO es seguridad fuerte: el código viaja al navegador,
 * así que un usuario técnico podría saltárselo. Sirve para que un curioso no entre
 * sin más — una barrera básica, tal como se pidió.
 *
 * Para cambiar el acceso: edita USUARIO / CLAVE y vuelve a desplegar.
 */
const USUARIO = 'kaizen'
const CLAVE = 'Kaizen-9XPkybVfvuAt8B'
const LS_KEY = 'kaizen_acceso'

export function Gate({ children }: { children: ReactNode }) {
  const [ok, setOk] = useState(() => localStorage.getItem(LS_KEY) === 'ok')
  const [usuario, setUsuario] = useState('')
  const [clave, setClave] = useState('')
  const [error, setError] = useState(false)

  if (ok) return <>{children}</>

  const entrar = (e: FormEvent) => {
    e.preventDefault()
    if (usuario.trim() === USUARIO && clave === CLAVE) {
      localStorage.setItem(LS_KEY, 'ok')
      setOk(true)
    } else {
      setError(true)
    }
  }

  const limpiarError = () => error && setError(false)

  return (
    <div style={wrap}>
      <form onSubmit={entrar} style={card}>
        <div style={marca}>Kaizen</div>
        <p style={{ margin: '2px 0 16px', color: '#9a9690', fontSize: 14 }}>Acceso interno</p>
        <input
          style={input}
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => { setUsuario(e.target.value); limpiarError() }}
          autoFocus
          autoComplete="username"
        />
        <input
          style={input}
          type="password"
          placeholder="Contraseña"
          value={clave}
          onChange={(e) => { setClave(e.target.value); limpiarError() }}
          autoComplete="current-password"
        />
        {error && <p style={{ margin: '2px 0 0', color: '#e06b4a', fontSize: 13 }}>Usuario o contraseña incorrectos.</p>}
        <button type="submit" style={boton}>Entrar</button>
      </form>
    </div>
  )
}

const wrap: CSSProperties = {
  position: 'fixed', inset: 0, display: 'grid', placeItems: 'center',
  background: '#0c0c0a', padding: 20, zIndex: 9999,
}
const card: CSSProperties = {
  width: '100%', maxWidth: 320, background: '#1a1a17', border: '1px solid #2a2a25',
  borderRadius: 14, padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 10,
  fontFamily: '"DM Sans", system-ui, sans-serif',
}
const marca: CSSProperties = {
  fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 26,
  color: '#e8c97a', letterSpacing: '-0.01em',
}
const input: CSSProperties = {
  background: '#0c0c0a', border: '1px solid #3a3a33', borderRadius: 8,
  padding: '11px 13px', color: '#f0ede6', fontSize: 15, outline: 'none',
}
const boton: CSSProperties = {
  marginTop: 8, background: '#e8c97a', color: '#0c0c0a', border: 0, borderRadius: 8,
  padding: '11px', fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: '"Syne", sans-serif',
}
