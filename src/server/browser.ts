import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';
import { installDbDevTools } from './db';

export const worker = setupWorker(...handlers);

/**
 * The app is served from a sub-path (`base: '/sandbox/'`), which also becomes
 * the service worker scope. Both the worker script and every API route have to
 * live under it, otherwise requests slip past the mock and hit the network.
 */
export const startMockBackend = () => {
  installDbDevTools();

  return worker.start({
    serviceWorker: { url: `${import.meta.env.BASE_URL}mockServiceWorker.js` },
    onUnhandledRequest: 'bypass',
  });
};
