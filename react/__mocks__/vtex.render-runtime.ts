export const useRuntime = jest.fn(() => ({
  navigate: jest.fn(),
  account: 'test-account',
}))
