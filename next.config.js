/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'prisma', 'bcrypt'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Prevent webpack from bundling native server-only packages
      const existing = Array.isArray(config.externals) ? config.externals : [];
      config.externals = [
        ...existing,
        '@prisma/client',
        'prisma',
        'bcrypt',
        '_http_common',
      ];
    }
    return config;
  },
}

module.exports = nextConfig
