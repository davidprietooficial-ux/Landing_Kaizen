import type { NextConfig } from "next";

// URL de producción de la app de cierre (proyecto Vercel aparte: propio React,
// propio backend con credenciales de GHL/Sheets/email — nunca se mezcla con
// el bundle público de la landing). Ver /cierre/README.md.
const CIERRE_ORIGIN = "https://kaizen-cierre.vercel.app";

const nextConfig: NextConfig = {
  experimental: {
    // CSS dentro del HTML (elimina la request que bloqueaba el renderizado).
    // Vale la pena aquí: el CSS pesa ~9KB y el tráfico de pauta es primera visita.
    inlineCss: true,
  },
  async rewrites() {
    return [
      // ":path*" (cero o más) también matchea el /cierre "pelado", sin barra
      // final — no hace falta redirect: Next ya normaliza /cierre/ -> /cierre
      // por su cuenta (trailingSlash: false por defecto) y un redirect propio
      // aquí chocaría con esa normalización y crearía un bucle.
      { source: "/cierre/:path*", destination: `${CIERRE_ORIGIN}/:path*` },
    ];
  },
};

export default nextConfig;
