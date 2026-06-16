import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function Svg({ size = 20, children, ...rest }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  )
}

export const ChevronDown = (p: IconProps) => <Svg {...p}><path d="m6 9 6 6 6-6" /></Svg>
export const ArrowRight = (p: IconProps) => <Svg {...p}><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></Svg>
export const ArrowDown = (p: IconProps) => <Svg {...p}><path d="M12 5v14" /><path d="m6 13 6 6 6-6" /></Svg>
export const Check = (p: IconProps) => <Svg {...p}><path d="M20 6 9 17l-5-5" /></Svg>
export const Play = (p: IconProps) => <Svg {...p}><path d="M7 5v14l11-7z" /></Svg>

export const Camera = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 8a2 2 0 0 1 2-2h2l1.5-2h7L17 6h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <circle cx="12" cy="12.5" r="3.2" />
  </Svg>
)
export const Layers = (p: IconProps) => (
  <Svg {...p}><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 13 9 5 9-5" /></Svg>
)
export const Film = (p: IconProps) => (
  <Svg {...p}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4" /></Svg>
)
export const Send = (p: IconProps) => (
  <Svg {...p}><path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4z" /></Svg>
)
export const Sparkle = (p: IconProps) => (
  <Svg {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4" /><path d="M12 8.5 13.4 11l2.5 1-2.5 1L12 15.5 10.6 13l-2.5-1 2.5-1z" /></Svg>
)
export const Shield = (p: IconProps) => (
  <Svg {...p}><path d="M12 3 5 6v5c0 4 3 6.5 7 8 4-1.5 7-4 7-8V6z" /><path d="m9.5 12 1.7 1.7 3.3-3.4" /></Svg>
)
export const Clock = (p: IconProps) => (
  <Svg {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 1.8" /></Svg>
)
export const Repeat = (p: IconProps) => (
  <Svg {...p}><path d="m17 2 3 3-3 3" /><path d="M20 5H8a4 4 0 0 0-4 4v1" /><path d="m7 22-3-3 3-3" /><path d="M4 19h12a4 4 0 0 0 4-4v-1" /></Svg>
)
export const Compass = (p: IconProps) => (
  <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5z" /></Svg>
)
export const Library = (p: IconProps) => (
  <Svg {...p}><path d="M5 4v16M9 4v16" /><path d="m13 5 4 15 3-1L16 4z" /><path d="M4 20h6" /></Svg>
)
export const Grid = (p: IconProps) => (
  <Svg {...p}><rect x="4" y="4" width="7" height="7" rx="1" /><rect x="13" y="4" width="7" height="7" rx="1" /><rect x="4" y="13" width="7" height="7" rx="1" /><rect x="13" y="13" width="7" height="7" rx="1" /></Svg>
)
export const Calendar = (p: IconProps) => (
  <Svg {...p}><rect x="3.5" y="5" width="17" height="16" rx="2" /><path d="M3.5 9.5h17M8 3v4M16 3v4" /></Svg>
)
export const Target = (p: IconProps) => (
  <Svg {...p}><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1" /></Svg>
)
export const Lock = (p: IconProps) => (
  <Svg {...p}><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></Svg>
)

/* ── contacto / redes ── */
export const Mail = (p: IconProps) => (
  <Svg {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3.5 7 8.5 6 8.5-6" /></Svg>
)
export const Phone = (p: IconProps) => (
  <Svg {...p}><path d="M6.5 3.5h3l1.5 4-2 1.4a11 11 0 0 0 5.1 5.1l1.4-2 4 1.5v3a2 2 0 0 1-2.2 2A16 16 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z" /></Svg>
)
export const WhatsApp = (p: IconProps) => (
  <Svg {...p}><path d="M3.5 20.5 5 16a8 8 0 1 1 3 3z" /><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5.6 0 1-.2 1-.8 0-.3-.2-.6-.5-.8l-1.2-.6c-.3-.1-.6 0-.8.2l-.3.4c-1-.4-1.8-1.2-2.2-2.2l.4-.3c.2-.2.3-.5.2-.8l-.6-1.2c-.2-.4-.5-.6-.9-.5-.6.1-.8.5-.8 1.1z" /></Svg>
)
export const Instagram = (p: IconProps) => (
  <Svg {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="4.5" /><circle cx="12" cy="12" r="3.8" /><circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" /></Svg>
)
export const TikTok = (p: IconProps) => (
  <Svg {...p}><path d="M14 4c.4 2.3 1.9 3.8 4 4v2.6c-1.5 0-2.9-.5-4-1.3V15a5.2 5.2 0 1 1-5.2-5.2c.3 0 .6 0 .9.1v2.7a2.6 2.6 0 1 0 1.8 2.4V4z" /></Svg>
)
export const Youtube = (p: IconProps) => (
  <Svg {...p}><rect x="3" y="6" width="18" height="12" rx="3.5" /><path d="m10.5 9.5 4 2.5-4 2.5z" fill="currentColor" stroke="none" /></Svg>
)
export const Linkedin = (p: IconProps) => (
  <Svg {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="2.5" /><path d="M8 10.5V16M8 7.5v.01M12 16v-3.2c0-1.2.8-2.1 2-2.1s2 .9 2 2.1V16" /></Svg>
)
export const Globe = (p: IconProps) => (
  <Svg {...p}><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.5 2.4 2.5 14.6 0 17M12 3.5c-2.5 2.4-2.5 14.6 0 17" /></Svg>
)
