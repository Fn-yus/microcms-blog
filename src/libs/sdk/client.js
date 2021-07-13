import { createClient } from 'microcms-js-sdk';

export const client = createClient({
  serviceDomain: 'blogforpic',
  apiKey: process.env.API_KEY,
});