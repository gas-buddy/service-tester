import type { Config } from '@jest/types';

const transform = {
  '^.+\\.[jt]sx?$': 'babel-jest',
} as const;

const assetModuleNameMapper = {
  '\\.(svg|png|jpe?g|gif)$': require.resolve('./webJestFileMock'),
};

// Unit tests co-located with source, run under jsdom (DOM APIs, React components).
export const webJestUnitProjectConfig: Config.InitialProjectOptions = {
  displayName: 'unit',
  testEnvironment: 'jsdom',
  transform,
  moduleNameMapper: assetModuleNameMapper,
  testMatch: ['<rootDir>/src/**/*.(test|spec).[jt]s?(x)'],
};

// Integration tests under tests/, run under node (SSR, service boot, supertest).
export const webJestIntegrationProjectConfig: Config.InitialProjectOptions = {
  displayName: 'integration',
  testEnvironment: 'node',
  transform,
  testMatch: ['<rootDir>/tests/**/*.(test|spec).[jt]s?(x)'],
};

// babel-jest baseline for web apps (React/JSX/CSS-modules pipeline), as opposed
// to the ts-jest-based `jestConfig` exported from index.ts. Consuming apps can
// spread this and override/replace either project, e.g.:
//   const unit = { ...webJestUnitProjectConfig, setupFilesAfterEnv: [...] };
//   module.exports = { ...webJestConfig, projects: [unit, webJestIntegrationProjectConfig] };
export const webJestConfig: Config.InitialOptions = {
  projects: [webJestUnitProjectConfig, webJestIntegrationProjectConfig],
};
