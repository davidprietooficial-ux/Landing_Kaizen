// Logo de marca en CSS (no imagen): caja dorada con "Kaizen" en la tipografía de
// marca + brillo de vidrio. Al lado se acompaña con "STUDIOS" (en Header/Footer).
// `size` = tamaño de fuente de "Kaizen" en px (la caja escala con padding em).
export default function Logo({ size = 22 }: { size?: number }) {
  return (
    <span className="kz-logo" style={{ fontSize: size }} aria-hidden="true">
      <span className="kz-logo__word">Kaizen</span>
    </span>
  )
}
