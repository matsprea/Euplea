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
  i18n: {
    locales: ['en', 'it'],
    defaultLocale: 'it',
    localeDetection: true,
  },
})

module.exports = nextConfig
