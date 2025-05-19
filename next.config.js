/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    domains: [],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.vercel.com",
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ["image/webp"],
    minimumCacheTTL: 60,
  },

  experimental: {
    optimizePackageImports: ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu"],
    typedRoutes: true,
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ]
  },

  async redirects() {
    return []
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.svg$/i,
      use: ["@svgr/webpack"],
    })

    return config
  },

  output: process.env.NEXT_OUTPUT_MODE === "export" ? "export" : undefined,
}

module.exports = nextConfig
