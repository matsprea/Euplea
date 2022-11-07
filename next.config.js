// @ts-check
const withPWA = require('next-pwa')({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
  })
const { i18n } = require('./next-i18next.config')

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = withPWA({
  reactStrictMode: true,
  target: process.env.BUILD_TARGET,
  i18n,
})

module.exports = nextConfig
