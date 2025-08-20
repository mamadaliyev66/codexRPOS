// jest.config.js
module.exports = {
  preset: 'jest-expo',
  testMatch: ['**/__tests__/**/*.test.ts'], // run ONLY .ts tests
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|expo(nent)?|expo-router|@expo/.*|react-navigation|@react-navigation/.*|@react-native-community/.*|firebase|@firebase)',
  ],
};
