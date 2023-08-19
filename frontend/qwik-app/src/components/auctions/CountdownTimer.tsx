import { component$, useSignal } from '@builder.io/qwik';

export default component$<{ auctionEnd: string }>(({ auctionEnd }) => {
  const completed = useSignal<boolean>(false);
  const days = 10;
  const hours = 9;

  return (
    <div>
      <div
        class={`
        border-2 
        border-white 
        text-white 
        py-1 
        px-2 
        rounded-lg 
        flex 
        justify-center
        ${
          completed.value
            ? 'bg-red-600'
            : days === 0 && hours < 10
            ? 'bg-amber-600'
            : 'bg-green-600'
        }
      `}
      ></div>
    </div>
  );
});
