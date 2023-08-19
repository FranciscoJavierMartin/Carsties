import { component$, useSignal } from '@builder.io/qwik';
import type { QwikKeyboardEvent } from '@builder.io/qwik';
import { BsSearch } from '@qwikest/icons/bootstrap';

export default component$(() => {
  const value = useSignal<string>('');

  return (
    <div class='flex w-[50%] items-center border-2 rounded-full py-2 shadow-sm'>
      <input
        bind:value={value}
        onKeyDown$={(e: QwikKeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') {
            console.log('Here');
          }
        }}
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
      {/* TODO: Fix color */}
      <button class='outline-1 outline-red-500'>
        <BsSearch class='rounded-full p-2 cursor-pointer mx-2' />
      </button>
    </div>
  );
});
