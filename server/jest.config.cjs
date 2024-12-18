module.exports = {
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  moduleFileExtensions: ['js', 'json', 'node'],
  transform: {
    '^.+\\.(js)$': 'babel-jest',
  },
};