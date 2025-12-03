/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Handle environment variables
  env: {
    DATABASE_URL: process.env.DATABASE_URL || "file:./prisma/dev.db",
  },
}

export default nextConfig
