'use client'

import { useState } from 'react'

// Retrato con respaldo: si la foto no existe todavía, muestra la inicial del
// nombre sobre el placeholder dorado — mismo patrón que Testimonials.tsx.
export default function CaseAvatar({ src, name }: { src: string; name: string }) {
  const [failed, setFailed] = useState(false)
  if (failed) return <span className="t-card__ph" aria-hidden="true">{name.charAt(0)}</span>
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" loading="lazy" width={48} height={48} onError={() => setFailed(true)} />
}
