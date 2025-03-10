const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  testEnvironment: "node", // Changer de jsdom à node pour éviter les problèmes avec Prisma
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  clearMocks: true,
  resetMocks: true,
};

module.exports = createJestConfig(customJestConfig);
