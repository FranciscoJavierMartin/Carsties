import { component$ } from '@builder.io/qwik';
import Logo from '~/components/nav/Logo';

export default component$(() => {
  return (
    <header class='sticky top-0 z-50 flex justify-between bg-white p-5 items-center text-gray-800 shadow-md'>
      <Logo />
    </header>
  );
});
