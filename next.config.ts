import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // CSS dentro del HTML (elimina la request que bloqueaba el renderizado).
    // Vale la pena aquí: el CSS pesa ~9KB y el tráfico de pauta es primera visita.
    inlineCss: true,
  },
};

export default nextConfig;
