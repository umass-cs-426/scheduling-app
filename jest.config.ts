import type { Config } from "jest";

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["**/*.test.ts"],
    clearMocks: true,
    verbose: true
};

export default config;
