import { server$ } from '@builder.io/qwik-city';

export const getData = server$(async function (query: string) {
  console.log(query, this.env.get('BACKEND_URL'));
});
