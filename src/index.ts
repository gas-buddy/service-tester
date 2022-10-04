import path from 'path';
import readPackageUp from 'read-pkg-up';
import { ServiceFactory, ServiceStartOptions, startApp } from '@gasbuddy/service';

import type { ServiceExpress } from '@gasbuddy/service';

let app: ServiceExpress | undefined;
let appService: ServiceFactory | undefined;

export async function getReusableApp(options?: ServiceStartOptions | ServiceFactory, cwd?: string) {
  if (!options) {
    if (!app) {
      throw new Error('getReusableApp() called with no options, requires existing app');
    }
    return app;
  }
  const factory = typeof options === 'function' ? options : options.service;
  if (!app || appService !== factory) {
    // If they don't pass service name and root directory, try and figure it out
    if (typeof options === 'function') {
      const pkg = await readPackageUp({ cwd: cwd || process.cwd() });
      if (!pkg) {
        throw new Error('Could not find relevant package.json for the service');
      }
      app = await startApp({
        service: options,
        name: pkg.packageJson.name.split('/')[1],
        rootDirectory: path.dirname(pkg.path),
        codepath: 'src',
      });
      appService = options;
    } else {
      app = await startApp({ codepath: 'src', ...options });
      appService = options.service;
    }
  }
  return app;
}

export async function clearReusableApp() {
  if (app) {
    await app.locals.service?.stop?.();
  }
  app = undefined;
  appService = undefined;
}
