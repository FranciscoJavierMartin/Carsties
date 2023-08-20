import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';

export default component$<{ auctionEnd: string }>(({ auctionEnd }) => {
  const isCompleted = useSignal<boolean>(false);
  const days = useSignal<number>(0);
  const hours = useSignal<number>(0);
  const minutes = useSignal<number>(0);
  const seconds = useSignal<number>(0);

  useVisibleTask$(({ cleanup }) => {
    const finalDate = new Date(auctionEnd).getTime();

    const interval = setInterval(() => {
      const currentDate = Date.now();
      const timeLeft = finalDate - currentDate;
      const total = Math.round(parseFloat((timeLeft / 1000).toFixed(0)) * 1000);
      const totalSeconds = Math.abs(total) / 1000;

      days.value = Math.floor(totalSeconds / (3600 * 24));
      hours.value = Math.floor((totalSeconds / 3600) % 24);
      minutes.value = Math.floor((totalSeconds / 60) % 60);
      seconds.value = Math.floor(totalSeconds % 60);
      isCompleted.value = totalSeconds <= 0;
    }, 1000);

    cleanup(() => clearInterval(interval));
  });

  return (
    <div>
      <div
        class={[
          'border-2',
          'border-white',
          'text-white',
          'py-1',
          'px-2',
          'rounded-lg',
          'flex',
          'justify-center',
          isCompleted.value
            ? 'bg-red-600'
            : days.value === 0 && hours.value < 10
            ? 'bg-amber-600'
            : 'bg-green-600',
          {
            hidden: !(
              days.value ||
              hours.value ||
              minutes.value ||
              seconds.value
            ),
          },
        ]}
      >
        {isCompleted.value ? (
          <span>Auction finished</span>
        ) : (
          <span>
            {days.value.toString().padStart(2, '0')}:
            {hours.value.toString().padStart(2, '0')}:
            {minutes.value.toString().padStart(2, '0')}:
            {seconds.value.toString().padStart(2, '0')}
          </span>
        )}
      </div>
    </div>
  );
});
