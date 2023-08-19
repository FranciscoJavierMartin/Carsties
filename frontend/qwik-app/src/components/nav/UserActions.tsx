import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import {
  HiUserMini,
  HiTrophyMini,
  HiCogMini,
  HiArrowLeftCircleOutline,
} from '@qwikest/icons/heroicons';
import { BsCarFrontFill } from '@qwikest/icons/bootstrap';

export default component$<{ user: Partial<any> }>(({ user }) => {
  return (
    <>
      <button
        id='dropdownUser'
        data-dropdown-toggle='dropdownUserOptions'
        class='flex items-center'
      >
        Welcome {user?.name ?? 'Bob Smith'}
        <svg
          class='w-2.5 h-2.5 ml-2.5'
          aria-hidden='true'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 10 6'
        >
          <path
            stroke='currentColor'
            stroke-linecap='round'
            stroke-linejoin='round'
            stroke-width='2'
            d='m1 1 4 4 4-4'
          />
        </svg>
      </button>
      <div
        id='dropdownUserOptions'
        class='z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44'
      >
        <ul class='py-2 text-sm text-gray-700' aria-labelledby='dropdownUser'>
          <li>
            <Link
              href='/'
              class='flex items-center justify-start px-4 py-2 hover:bg-gray-100'
            >
              <HiUserMini class='mr-2 h-4 w-4' />
              My auctions
            </Link>
          </li>
          <li>
            <Link
              href='/'
              class='flex items-center justify-start px-4 py-2 hover:bg-gray-100'
            >
              <HiTrophyMini class='mr-2 h-4 w-4' />
              Auctions won
            </Link>
          </li>
          <li>
            <Link
              href='/'
              class='flex items-center justify-start px-4 py-2 hover:bg-gray-100'
            >
              <BsCarFrontFill class='mr-2 h-4 w-4' />
              Sell my car
            </Link>
          </li>
          <li>
            <Link
              href='/session'
              class='flex items-center justify-start px-4 py-2 hover:bg-gray-100'
            >
              <HiCogMini class='mr-2 h-4 w-4' />
              Session (dev only)
            </Link>
          </li>
        </ul>
        <div class='py-2 hover:bg-gray-100'>
          <button class='flex items-center justify-start px-4 py-2 text-sm text-gray-700 '>
            <HiArrowLeftCircleOutline class='mr-2 h-4 w-4' />
            Sign out
          </button>
        </div>
      </div>
    </>
  );
});
