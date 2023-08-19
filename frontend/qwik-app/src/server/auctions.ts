import { server$ } from '@builder.io/qwik-city';
import type { Auction, PagedResult } from '~/types';

export const getData = server$(async function (
  query: string
): Promise<PagedResult<Auction>> {
  const res = await fetch(`${this.env.get('BACKEND_URL')}search${query}`);

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
});
