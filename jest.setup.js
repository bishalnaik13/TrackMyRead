jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('react-native-uuid', () => ({
  v4: () => 'test-uuid-1234-5678-9012-345678901234',
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ items: [] }),
  })
);

beforeEach(() => {
  jest.clearAllMocks();
});