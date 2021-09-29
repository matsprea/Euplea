const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')
const { i18n } = require('./next-i18next.config')

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
  i18n
})

module.exports = nextConfig
