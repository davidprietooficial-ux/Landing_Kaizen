'use client'

import { useState } from 'react'
import styles from './quienes-somos.module.css'
import { Check } from '@/components/Icons'
import { CONTACT } from '@/lib/config'

const AREA_OPTIONS = [
  { value: 'marketing', label: 'Marketing' },
  { value: 'audiovisual', label: 'Audiovisual' },
  { value: 'desarrollo', label: 'Desarrollo' },
  { value: 'otro', label: 'Otro' },
]

type FormState = {
  name: string
  email: string
  area: string
  areaOther: string
  portfolio: string
  message: string
  hp: string // honeypot
}

const EMPTY: FormState = {
  name: '',
  email: '',
  area: '',
  areaOther: '',
  portfolio: '',
  message: '',
  hp: '',
}

export default function CareerForm() {
  const [data, setData] = useState<FormState>(EMPTY)
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle')

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setData((d) => ({ ...d, [key]: value }))

  const canSubmit = !!(data.name && data.email && data.area && data.message)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    setStatus('sending')

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'careers',
          name: data.name,
          email: data.email,
          area: data.area === 'otro' ? data.areaOther || 'Otro' : data.area,
          portfolio: data.portfolio,
          message: data.message,
          hp: data.hp,
        }),
      })
      setStatus(res.ok ? 'ok' : 'error')
      if (res.ok) setData(EMPTY)
    } catch {
      setStatus('error')
    }
  }

  if (status === 'ok') {
    return (
      <div className="form-ok">
        <strong style={{ display: 'block', marginBottom: 6 }}>Recibido.</strong>
        Revisamos tu perfil y te contactamos si encaja con algún proyecto.
      </div>
    )
  }

  return (
    <form className={styles.formCard} onSubmit={submit}>
      {/* honeypot — invisible para personas, los bots sí lo rellenan */}
      <input
        type="text"
        name="hp"
        value={data.hp}
        onChange={(e) => set('hp', e.target.value)}
        autoComplete="off"
        tabIndex={-1}
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
      />

      <div style={{ display: 'grid', gap: 16 }}>
        <div className="field-row">
          <div className="field">
            <label htmlFor="cf-name">Nombre completo</label>
            <input id="cf-name" required value={data.name} onChange={(e) => set('name', e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="cf-email">Email</label>
            <input id="cf-email" type="email" required value={data.email} onChange={(e) => set('email', e.target.value)} />
          </div>
        </div>

        <div className="field">
          <label>Área de interés</label>
          <div className="qform__options">
            {AREA_OPTIONS.map((o) => (
              <button
                type="button"
                key={o.value}
                className={`qform__option${data.area === o.value ? ' is-selected' : ''}`}
                onClick={() => set('area', o.value)}
              >
                {o.label}
              </button>
            ))}
          </div>
          {data.area === 'otro' && (
            <input
              style={{ marginTop: 8 }}
              placeholder="Cuéntanos en qué área"
              value={data.areaOther}
              onChange={(e) => set('areaOther', e.target.value)}
            />
          )}
        </div>

        <div className="field">
          <label htmlFor="cf-portfolio">Portafolio o Instagram</label>
          <input
            id="cf-portfolio"
            placeholder="https://…"
            value={data.portfolio}
            onChange={(e) => set('portfolio', e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="cf-message">Mensaje</label>
          <textarea
            id="cf-message"
            required
            placeholder="Quién eres, qué haces y por qué quieres trabajar con nosotros."
            value={data.message}
            onChange={(e) => set('message', e.target.value)}
          />
        </div>
      </div>

      <div className={styles.formActions}>
        <button type="submit" className="btn-gold" disabled={!canSubmit || status === 'sending'}>
          {status === 'sending' ? 'Enviando…' : 'Enviar'} <Check size={16} />
        </button>
        {status === 'error' && <p className="form-note">No se pudo enviar. Escríbenos directo a {CONTACT.email}.</p>}
      </div>
    </form>
  )
}
