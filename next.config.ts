import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Opciones de configuración para ignorar errores estrictos en despliegue */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;