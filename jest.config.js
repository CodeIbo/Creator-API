module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  coverageDirectory: "coverage",
  collectCoverageFrom: ["src/**/*.{js,ts}"],
  coverageThreshold: {
    branches: 0,
    functions: 0,
    lines: 0,
    statements: 0,
  },
  moduleNameMapper: {
    "@guards/(.*)": "<rootDir>/src/guards/$1",
    "@db/(.*)": "<rootDir>/src/db/$1",
    "@config/(.*)": "<rootDir>/src/config/$1",
    "@controllers/(.*)": "<rootDir>/src/controllers/$1",
    "@routes/(.*)": "<rootDir>/src/routes/$1",
    "@models/(.*)": "<rootDir>/src/models/$1",
    "@middleware/(.*)": "<rootDir>/src/middleware/$1",
    "@src/(.*)": "<rootDir>/src/$1",
  },
  moduleDirectories: ["node_modules", "src"],
};
