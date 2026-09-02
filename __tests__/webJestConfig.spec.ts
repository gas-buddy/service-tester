import fs from 'fs';
import {
  webJestConfig,
  webJestUnitProjectConfig,
  webJestIntegrationProjectConfig,
} from '../src/webJestConfig';

describe('webJestConfig', () => {
  test('exposes a unit (jsdom) + integration (node) two-project shape', () => {
    expect(webJestConfig.projects).toEqual([webJestUnitProjectConfig, webJestIntegrationProjectConfig]);
  });

  test('unit project runs under jsdom and maps static assets to a real file', () => {
    expect(webJestUnitProjectConfig.testEnvironment).toBe('jsdom');
    expect(webJestUnitProjectConfig.transform).toEqual({ '^.+\\.[jt]sx?$': 'babel-jest' });

    const mapper = webJestUnitProjectConfig.moduleNameMapper as Record<string, string>;
    const assetStub = mapper['\\.(svg|png|jpe?g|gif)$'];
    expect(fs.existsSync(assetStub)).toBe(true);
  });

  test('integration project runs under node with no asset mapping', () => {
    expect(webJestIntegrationProjectConfig.testEnvironment).toBe('node');
    expect(webJestIntegrationProjectConfig.moduleNameMapper).toBeUndefined();
  });
});
