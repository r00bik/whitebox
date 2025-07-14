import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: "src",
  moduleFileExtensions: ["js", "json", "ts"],
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  moduleNameMapper: {
    "^@back/(.*)$": "<rootDir>/$1",
    "^@generated/prisma$": "<rootDir>/../generated/prisma",
  },
  coverageDirectory: "../coverage",
  transformIgnorePatterns: ["node_modules/(?!(@generated/prisma)/)"],
};

export default config;
