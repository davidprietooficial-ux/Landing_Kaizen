import { Component, type CSSProperties, type ErrorInfo, type ReactNode } from 'react'
import { EMPRESA } from './config/empresa.config'

/**
 * RED DE SEGURIDAD contra pantalla en blanco.
 *
 * Sin esto, un error de render en CUALQUIER componente del lienzo (una carrera
 * de datos, un video que no cargó, lo que sea) tumba TODO el árbol de React y el
 * cliente ve una página en blanco — inaceptable en plena reunión de cierre.
 *
 * Un solo reintento automático y silencioso (recarga la página) resuelve la
 * mayoría de estos casos, que suelen ser transitorios. sessionStorage evita el
 * loop: si el error persiste tras recargar, se muestra la pantalla de respaldo
 * con un botón manual en vez de recargar sin fin.
 *
 * Estilos en línea con valores fijos (no `var(--token)`): igual que Gate.tsx,
 * debe verse bien aunque el CSS del lienzo no haya terminado de cargar.
 */
const RELOAD_FLAG = 'kaizen_cierre_auto_reload'

interface Props {
  children: ReactNode
}
interface State {
  fallo: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { fallo: false }

  static getDerivedStateFromError() {
    return { fallo: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[Kaizen · Lienzo] Error de render capturado:', error, info)
    if (!sessionStorage.getItem(RELOAD_FLAG)) {
      sessionStorage.setItem(RELOAD_FLAG, '1')
      window.location.reload()
    }
  }

  render() {
    if (!this.state.fallo) return this.props.children
    const whatsapp = EMPRESA.contacto.replace(/\D/g, '')
    return (
      <div style={wrap}>
        <div style={card}>
          <div style={marca}>Kaizen</div>
          <p style={texto}>Algo no cargó bien. Ya lo sabemos — intenta recargar.</p>
          <button style={boton} onClick={() => window.location.reload()}>
            Recargar
          </button>
          <a style={link} href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer">
            ¿Sigue sin cargar? Escríbenos por WhatsApp
          </a>
        </div>
      </div>
    )
  }
}

const wrap: CSSProperties = {
  position: 'fixed', inset: 0, display: 'grid', placeItems: 'center',
  background: '#0c0c0a', padding: 20, zIndex: 9999,
}
const card: CSSProperties = {
  width: '100%', maxWidth: 320, background: '#1a1a17', border: '1px solid #2a2a25',
  borderRadius: 14, padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 10,
  textAlign: 'center', fontFamily: '"DM Sans", system-ui, sans-serif',
}
const marca: CSSProperties = {
  fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 26,
  color: '#e8c97a', letterSpacing: '-0.01em',
}
const texto: CSSProperties = { margin: '2px 0 8px', color: '#9a9690', fontSize: 14, lineHeight: 1.5 }
const boton: CSSProperties = {
  background: '#e8c97a', color: '#0c0c0a', border: 0, borderRadius: 8,
  padding: '11px', fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: '"Syne", sans-serif',
}
const link: CSSProperties = { marginTop: 4, color: '#9a9690', fontSize: 13, textDecoration: 'underline' }
