import createClient from 'openapi-fetch';
import type { paths } from './schema';

export const client = createClient<paths>({
  baseUrl: 'https://musicfun.it-incubator.app/api/1.0/',
  headers: {
    'api-key': '01767086-cd0e-4887-8f75-a7fd5a29c850',
  },
});
