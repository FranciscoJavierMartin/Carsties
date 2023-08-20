import { Slot, component$ } from '@builder.io/qwik';
import type { QwikMouseEvent } from '@builder.io/qwik';

export default component$<{
  onClick?: (
    event: QwikMouseEvent<HTMLButtonElement, MouseEvent>,
    element: HTMLButtonElement
  ) => any;
}>(({ onClick }) => {
  return (
    <button
      onClick$={onClick}
      class='
        group 
        flex 
        h-min 
        items-center 
        justify-center 
        p-0.5 
        text-center 
        font-medium 
        relative 
        focus:z-10 
        focus:outline-none 
        text-white 
      bg-cyan-700 
        border-transparent 
      enabled:hover:bg-cyan-800 
      focus:ring-cyan-300 
        border-0 
        rounded-lg 
        focus:ring-2'
    >
      <span
        class='
          items-stretch 
          flex 
          justify-center 
        bg-white 
        text-gray-900 
          transition-all 
          duration-75 
          ease-in 
          group-enabled:group-hover:bg-opacity-0 
          group-enabled:group-hover:text-inherit 
          w-full 
          rounded-md 
          text-sm 
          px-4 
          py-2 
          border 
          border-transparent'
      >
        <Slot />
      </span>
    </button>
  );
});
