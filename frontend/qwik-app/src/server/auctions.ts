import { server$ } from '@builder.io/qwik-city';

export const getData = server$(async function (query: string) {
  const res = await fetch(`${this.env.get('BACKEND_URL')}search${query}`);

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
});
