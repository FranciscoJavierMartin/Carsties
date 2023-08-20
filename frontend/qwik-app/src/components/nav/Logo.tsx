import { component$, useContext, $ } from '@builder.io/qwik';
import { useLocation, useNavigate } from '@builder.io/qwik-city';
import { BsCarFront } from '@qwikest/icons/bootstrap';
import { searchContext } from '~/store/searchAuctions';

export default component$(() => {
  const reset = useContext(searchContext).reset;
  const location = useLocation();
  const nav = useNavigate();

  const doReset = $(function (): void {
    if (location.url.pathname !== '/') {
      nav('/');
    }

    reset();
  });

  return (
    <div
      onClick$={doReset}
      class='cursor-pointer flex items-center gap-2 text-3xl font-semibold text-red-500'
    >
      <BsCarFront />
      <div>Carsties Auctions</div>
    </div>
  );
});
