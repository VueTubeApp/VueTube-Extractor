module.exports = {
  roots: ["<rootDir>"],
  testMatch: [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)",
    "!**/youtube/**",
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js"],
  moduleNameMapper: {
    "@utils": "<rootDir>/src/utils",
    "@types": "<rootDir>/src/types",
    "@package": "<rootDir>/package.json",
  },
  reporters: ["default", "jest-junit"],
  collectCoverageFrom: ["./src/**"],
  coveragePathIgnorePatterns: [
    "node_modules",
    "test-config",
    "interfaces",
    "jestGlobalMocks.ts",
    ".module.ts",
    ".mock.ts",
    ".json",
    "__tests__",
    "./src/extractors/youtube/"
  ],
};
