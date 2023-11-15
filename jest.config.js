module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.{js,ts}'],
  coverageThreshold: {
    branches: 0,
    functions: 0,
    lines: 0,
    statements: 0,
  },
  moduleNameMapper: {
    'src/guards/(.*)':'<rootDir>/src/guards/$1',
    'src/db/(.*)':'<rootDir>/src/db/$1',
    'src/config/(.*)':'<rootDir>/src/config/$1',
    'src/controllers/(.*)':'<rootDir>/src/controllers/$1',
    'src/routes/(.*)':'<rootDir>/src/routes/$1',
    'src/models/(.*)':'<rootDir>/src/models/$1',
    'src/middleware/(.*)':'<rootDir>/src/middleware/$1',
    'src/(.*)': '<rootDir>/src/$1'
  },
  "moduleDirectories": ['node_modules','src']
}
