const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = withPWA({
  pwa: {
    dest: 'public',
    runtimeCaching,
    disable: process.env.NODE_ENV === 'development',
  },
  reactStrictMode: true,
  target: process.env.BUILD_TARGET,
})

module.exports = nextConfig