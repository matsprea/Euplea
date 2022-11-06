/**
 * @type {import('next').NextConfig}
 **/
import nextJest from 'next/jest'

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  roots: ['<rootDir>'],
  moduleNameMapper: {
    '^components/(.*)$': '<rootDir>/components/$1',
    '^components$': '<rootDir>/components',
    '^cache/(.*)$': '<rootDir>/cache/$1',
    '^cache$': '<rootDir>/cache',
    '^context/(.*)$': '<rootDir>/context/$1',
    '^context$': '<rootDir>/context',
    '^hooks/(.*)$': '<rootDir>/hooks/$1',
    '^hooks$': '<rootDir>/hooks',
    '^pages/(.*)$': '<rootDir>/pages/$1',
    '^pages$': '<rootDir>/pages',
    '^query/(.*)$': '<rootDir>/query/$1',
    '^query$': '<rootDir>/query',
    '^types/(.*)$': '<rootDir>/types/$1',
    '^types$': '<rootDir>/types',
    '^utils/(.*)$': '<rootDir>/utils/$1',
    '^utils$': '<rootDir>/utils',
  },
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'jsx'],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  collectCoverageFrom: [
    '**/*.{js,ts,jsx,tsx}',
    '!**/node_modules/**',
    '!**/public/**',
    '!**/theme/**',
    '!**/types/**',
    '!**/.next/**',
    '!**/test/**',
  ],
  coveragePathIgnorePatterns: [
    'jest.config.js',
    'next-env.d.ts',
    'next-i18next.config.js',
    'next.config.js',
    '_document.js',
    'consts.ts',
    'index.ts',
  ],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(customJestConfig)
