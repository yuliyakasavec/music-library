import createClient, { type Middleware } from 'openapi-fetch';
import type { paths } from './schema';

const authMiddleware: Middleware = {
  onRequest({ request }) {
    const accessToken = localStorage.getItem('musicfun-access-token');
    if (accessToken) {
      request.headers.set('Authorization', 'Bearer ' + accessToken);
    }
    return request;
  },
  onResponse({ response }) {
    if (!response.ok) {
      throw new Error(
        `${response.url}: ${response.status} ${response.statusText}`
      );
    }
  },
};

export const client = createClient<paths>({
  baseUrl: 'https://musicfun.it-incubator.app/api/1.0/',
  headers: {
    'api-key': '01767086-cd0e-4887-8f75-a7fd5a29c850',
  },
});

client.use(authMiddleware);
