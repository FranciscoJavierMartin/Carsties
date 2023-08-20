import { component$, useContext, $ } from '@builder.io/qwik';
import type { QwikChangeEvent, QwikKeyboardEvent } from '@builder.io/qwik';
import { searchContext } from '~/store/searchAuctions';

export default component$(() => {
  const searchStore = useContext(searchContext);

  const search = $(function () {
    searchStore.searchTerm = searchStore.searchValue;
  });

  return (
    <div class='flex w-[50%] items-center border-2 rounded-full py-2 shadow-sm'>
      <input
        onChange$={(e: QwikChangeEvent<HTMLInputElement>) => {
          searchStore.searchValue = e.target.value;
        }}
        onKeyDown$={(e: QwikKeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') {
            search();
          }
        }}
        value={searchStore.searchValue}
        placeholder='Search for cars by make, model or color'
        class='
          flex-grow 
          pl-5 
          bg-transparent 
          focus:outline-none
          border-transparent
          focus:border-transparent 
          focus:ring-0 
          text-sm
        text-gray-600
        '
      />
      <button onClick$={search}>
        <svg
          stroke='currentColor'
          fill='currentColor'
          stroke-width='0'
          viewBox='0 0 512 512'
          class='bg-red-400 text-white rounded-full p-2 cursor-pointer mx-2'
          height='34'
          width='34'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path d='M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z'></path>
        </svg>
      </button>
    </div>
  );
});
