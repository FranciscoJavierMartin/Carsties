import { component$ } from '@builder.io/qwik';
import Logo from '~/components/nav/Logo';
import Search from '~/components/nav/Search';
import LoginButton from '~/components/nav/LoginButton';
import UserActions from '~/components/nav/UserActions';

export default component$(() => {
  return (
    <header class='sticky top-0 z-50 flex justify-between bg-white p-5 items-center text-gray-800 shadow-md'>
      <Logo />
      <Search />
      {/* <LoginButton /> */}
      <UserActions />
    </header>
  );
});
