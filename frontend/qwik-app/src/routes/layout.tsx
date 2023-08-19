import { component$, Slot } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';

export default component$(() => {
  return (
    <>
      <main class='container mx-auto px-5 pt-10'>
        <Slot />
      </main>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Carsties',
  meta: [
    {
      name: 'description',
      content: 'Best place to auction your car',
    },
  ],
};
