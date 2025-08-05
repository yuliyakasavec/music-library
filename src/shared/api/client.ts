import createClient, { type Middleware } from 'openapi-fetch';
import type { paths } from './schema';
import { apiKey, baseUrl } from '../config/api-config';
import { localStorageKeys } from '../config/localstorage-keys';

// mutex
let refreshPromise: Promise<void> | null = null;

function makeRefreshToken() {
  if (!refreshPromise) {
    refreshPromise = (async (): Promise<void> => {
      const refreshToken = localStorage.getItem(localStorageKeys.refreshToken);
      if (!refreshToken) throw new Error('No refresh token');

      const response = await fetch(baseUrl + 'auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'API-KEY': apiKey,
        },
        body: JSON.stringify({
          refreshToken,
        }),
      });

      if (!response.ok) {
        localStorage.removeItem(localStorageKeys.refreshToken);
        localStorage.removeItem(localStorageKeys.accessToken);
        throw new Error('Refresh token failed');
      }
      const data = await response.json();
      localStorage.setItem(localStorageKeys.accessToken, data.accessToken);
      localStorage.setItem(localStorageKeys.refreshToken, data.refreshToken);
    })();

    refreshPromise.finally(() => {
      refreshPromise = null;
    });

    return refreshPromise;
  }
}

const authMiddleware: Middleware = {
  onRequest({ request }) {
    const accessToken = localStorage.getItem(localStorageKeys.accessToken);
    if (accessToken) {
      request.headers.set('Authorization', 'Bearer ' + accessToken);
    }

    // @ts-expect-error hot fix
    request._retryRequest = request.clone();
    return request;
  },
  async onResponse({ request, response }) {
    if (response.ok) return response;
    if (!response.ok && response.status !== 401) {
      const errorBody = await response.json();
      throw errorBody;
    }

    try {
      await makeRefreshToken();
      // @ts-expect-error ignore it
      const originalRequest: Request = request._retryRequest;
      const retryRequest = new Request(originalRequest, {
        headers: new Headers(originalRequest.headers),
      });
      retryRequest.headers.set(
        'Authorization',
        'Bearer ' + localStorage.getItem(localStorageKeys.accessToken)
      );
      return fetch(retryRequest);
    } catch {
      return response;
    }
  },
};

export const client = createClient<paths>({
  baseUrl: baseUrl,
  headers: {
    'api-key': apiKey,
  },
});

client.use(authMiddleware);
