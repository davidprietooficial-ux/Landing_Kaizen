'use client'

import { useState } from 'react'
import {
  FORM_INTEREST_OPTIONS,
  FORM_TIMELINE_OPTIONS,
  FORM_REVENUE_BUCKETS,
  FORM_BUDGET_BUCKETS,
  COUNTRIES,
  ASSETS,
  CONTACT,
} from '@/lib/config'
import { ArrowRight, Check } from './Icons'

type Currency = 'COP' | 'USD'

type FormState = {
  name: string
  email: string
  country: string
  business: string
  website: string
  phone: string
  interest: string
  interestOther: string
  currency: Currency
  project: string
  revenue: string
  budget: string
  timeline: string
  hp: string // honeypot
}

const EMPTY: FormState = {
  name: '', email: '', country: '', business: '', website: '', phone: '',
  interest: '', interestOther: '', currency: 'COP', project: '',
  revenue: '', budget: '', timeline: '', hp: '',
}

// 2 pasos: (1) contacto + interés, (2) negocio + timing.
const STEP_TITLES = ['Contacto', 'Tu negocio']

export default function QualifyForm() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<FormState>(EMPTY)
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle')
  const [qualified, setQualified] = useState(false)

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setData((d) => ({ ...d, [key]: value }))

  const revenueBuckets = FORM_REVENUE_BUCKETS[data.currency]
  const budgetBuckets = FORM_BUDGET_BUCKETS[data.currency]
  const dialCode = COUNTRIES.find((c) => c.name === data.country)?.code ?? ''

  const canAdvance = () => {
    if (step === 1) {
      return !!(
        data.name && data.email && data.country && data.business && data.phone &&
        data.interest && data.currency
      )
    }
    return !!(data.revenue && data.budget && data.timeline)
  }

  const next = () => { if (canAdvance()) setStep((s) => Math.min(2, s + 1)) }
  const back = () => setStep((s) => Math.max(1, s - 1))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canAdvance()) return
    setStatus('sending')

    const revenueIsLow = (revenueBuckets as readonly string[]).indexOf(data.revenue) === 0
    const budgetIsLow = (budgetBuckets as readonly string[]).indexOf(data.budget) === 0
    const disqualifiedByMoney = revenueIsLow && budgetIsLow
    const disqualifiedByTimeline = data.timeline === 'explorando'
    const isQualified = !disqualifiedByMoney && !disqualifiedByTimeline
    setQualified(isQualified)

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'lead',
          ...data,
          phone: `${dialCode} ${data.phone}`.trim(),
          qualified: isQualified,
          disqualifiedReason: disqualifiedByTimeline ? 'timeline' : disqualifiedByMoney ? 'budget-revenue' : null,
        }),
      })
      setStatus(res.ok ? 'ok' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'ok') {
    const art = qualified ? '/stages/form-success.png' : '/stages/form-no-success.png'
    return (
      <div className="form-ok">
        {ASSETS.hasFormSuccessArt ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={art} alt="" className="form-ok__art" />
        ) : (
          <span className="form-ok__art form-ok__art--ph"><Check size={26} /></span>
        )}
        <strong>Gracias por la información.</strong>
        <p>Te contactaremos en menos de 24 horas al correo que dejaste.</p>
      </div>
    )
  }

  return (
    <form className="qform" onSubmit={step === 2 ? submit : (e) => { e.preventDefault(); next() }}>
      {/* honeypot — invisible para personas, los bots sí lo rellenan */}
      <input
        type="text" name="hp" value={data.hp} onChange={(e) => set('hp', e.target.value)}
        autoComplete="off" tabIndex={-1} aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
      />

      <div className="qform__steps" aria-hidden="true">
        {STEP_TITLES.map((t, i) => (
          <span key={t} className={`qform__dot${i + 1 <= step ? ' is-active' : ''}`}>{i + 1}</span>
        ))}
      </div>
      <p className="qform__step-title mono">Paso {step} de 2 · {STEP_TITLES[step - 1]}</p>

      {step === 1 && (
        <div className="qform__fields">
          <div className="field-row">
            <div className="field">
              <label htmlFor="qf-name">Nombre completo</label>
              <input id="qf-name" required value={data.name} onChange={(e) => set('name', e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="qf-email">Email</label>
              <input id="qf-email" type="email" required value={data.email} onChange={(e) => set('email', e.target.value)} />
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label htmlFor="qf-country">País</label>
              <select id="qf-country" required value={data.country} onChange={(e) => set('country', e.target.value)}>
                <option value="" disabled>Selecciona tu país</option>
                {COUNTRIES.map((c) => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="qf-phone">Teléfono</label>
              <div className="qform__phone">
                <span className="qform__phone-code mono">{dialCode || '+__'}</span>
                <input
                  id="qf-phone" type="tel" required inputMode="tel"
                  value={data.phone} onChange={(e) => set('phone', e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label htmlFor="qf-business">Nombre del negocio</label>
              <input id="qf-business" required value={data.business} onChange={(e) => set('business', e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="qf-website">Sitio web (si tienes)</label>
              <input id="qf-website" value={data.website} onChange={(e) => set('website', e.target.value)} />
            </div>
          </div>

          <div className="field">
            <label>¿Cómo podemos ayudarte?</label>
            <div className="qform__options">
              {FORM_INTEREST_OPTIONS.map((o) => (
                <button
                  type="button" key={o.value}
                  className={`qform__option${data.interest === o.value ? ' is-selected' : ''}`}
                  onClick={() => set('interest', o.value)}
                >
                  {o.label}
                </button>
              ))}
            </div>
            {data.interest === 'otro' && (
              <input
                style={{ marginTop: 8 }}
                placeholder="Cuéntanos qué necesitas"
                value={data.interestOther}
                onChange={(e) => set('interestOther', e.target.value)}
              />
            )}
          </div>
          <div className="field">
            <label>Moneda</label>
            <div className="qform__options">
              {(['COP', 'USD'] as Currency[]).map((c) => (
                <button
                  type="button" key={c}
                  className={`qform__option${data.currency === c ? ' is-selected' : ''}`}
                  onClick={() => set('currency', c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="field">
            <label htmlFor="qf-project">Cuéntanos sobre tu proyecto (opcional)</label>
            <textarea id="qf-project" value={data.project} onChange={(e) => set('project', e.target.value)} />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="qform__fields">
          <div className="field">
            <label>Facturación mensual actual — {data.currency}</label>
            <div className="qform__options qform__options--col">
              {revenueBuckets.map((b) => (
                <button
                  type="button" key={b}
                  className={`qform__option${data.revenue === b ? ' is-selected' : ''}`}
                  onClick={() => set('revenue', b)}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
          <div className="field">
            <label>Presupuesto mensual — {data.currency}</label>
            <div className="qform__options qform__options--col">
              {budgetBuckets.map((b) => (
                <button
                  type="button" key={b}
                  className={`qform__option${data.budget === b ? ' is-selected' : ''}`}
                  onClick={() => set('budget', b)}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
          <div className="field">
            <label>Cuándo quiere empezar</label>
            <div className="qform__options qform__options--col">
              {FORM_TIMELINE_OPTIONS.map((o) => (
                <button
                  type="button" key={o.value}
                  className={`qform__option${data.timeline === o.value ? ' is-selected' : ''}`}
                  onClick={() => set('timeline', o.value)}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="qform__nav">
        {step > 1 && (
          <button type="button" className="btn-ghost" onClick={back}>Atrás</button>
        )}
        {step < 2 ? (
          <button type="submit" className="btn-gold" disabled={!canAdvance()}>
            Siguiente <ArrowRight size={16} />
          </button>
        ) : (
          <button type="submit" className="btn-gold" disabled={!canAdvance() || status === 'sending'}>
            {status === 'sending' ? 'Enviando…' : 'Enviar'} <Check size={16} />
          </button>
        )}
      </div>
      {status === 'error' && (
        <p className="form-note">
          No se pudo enviar. Escríbenos directo a {CONTACT.email}.
        </p>
      )}
    </form>
  )
}
