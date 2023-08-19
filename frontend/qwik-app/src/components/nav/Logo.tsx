import { component$ } from '@builder.io/qwik';
import { BsCarFront } from '@qwikest/icons/bootstrap';

export default component$(() => {
  return (
    <div class='cursor-pointer flex items-center gap-2 text-3xl font-semibold text-red-500'>
      <BsCarFront />
      <div>Carsties Auctions</div>
    </div>
  );
});
