module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(t|j)sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^vtex.styleguide/?(.*)?': '<rootDir>/__mocks__/vtex.styleguide.ts',
    '^vtex.render-runtime/?(.*)?': '<rootDir>/__mocks__/vtex.render-runtime.ts',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  testMatch: [
    '<rootDir>/__test__/**/*.test.ts',
    '<rootDir>/__test__/**/*.test.tsx',
  ],
  moduleDirectories: ['node_modules', 'src'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/types.ts',
  ],
  roots: ['<rootDir>'],
}
