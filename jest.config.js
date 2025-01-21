module.exports = {
  displayName: 'react',
  testEnvironment: 'jest-environment-jsdom',
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  setupFiles: ['<rootDir>/jest.setEnvVars.js'],
  modulePaths: ['<rootDir>/react/'],
  transform: {
    '^.+\\.(t|j)sx?$': ['ts-jest', { tsconfig: './react/tsconfig.json' }],
  },
  moduleNameMapper: {
    '^vtex.styleguide$': '<rootDir>/react/__mocks__/vtex/styleguide.tsx',
    '^react-intl$': '<rootDir>/react/__mocks__/react-intl/index.tsx',
    '^vtex.render-runtime$':
      '<rootDir>/react/__mocks__/vtex/render-runtime.tsx',
    '^@vtex/test-tools/(.*)$': '<rootDir>/node_modules/@vtex/test-tools/$1',
  },
}
