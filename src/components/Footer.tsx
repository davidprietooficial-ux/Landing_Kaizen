import { SITE, CONTACT, SOCIAL } from '@/lib/config'
import { Instagram, Youtube, /* Linkedin, */ Mail } from './Icons'
import Logo from './Logo'

const SOCIALS = [
  // --- LinkedIn oculto temporalmente (descomenta para reactivar) ---
  // { label: 'LinkedIn', Icon: Linkedin, href: SOCIAL.linkedin },
  { label: 'YouTube', Icon: Youtube, href: SOCIAL.youtube },
  { label: 'Instagram', Icon: Instagram, href: SOCIAL.instagram },
]

export default function Footer() {
  const year = new Date().getFullYear()
  const activeSocials = SOCIALS.filter((s) => s.href)

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            {/* isotipo en versión plana (sin reflejo) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="lz-logo--flat" src="/logo/logo-kaizen.png" alt="" width={212} height={212} />
            <div className="iso">
              <Logo size={20} />
              <span className="iso__studios">STUDIOS</span>
            </div>
            <p>{SITE.tagline} Calidad de cine en cada pieza, sistematizado.</p>
          </div>

          <div className="footer__col">
            <h5>Redes</h5>
            {activeSocials.length ? (
              <div className="footer__socials">
                {activeSocials.map(({ label, Icon, href }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="footer__social">
                    <Icon size={16} /> {label}
                  </a>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--muted2)' }}>Por agregar</p>
            )}
          </div>

          <div className="footer__col">
            <h5>Contacto</h5>
            <a href={`mailto:${CONTACT.email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Mail size={16} /> {CONTACT.email}
            </a>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {year} {SITE.name} · {SITE.founder}</span>
        </div>
      </div>
    </footer>
  )
}
