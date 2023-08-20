import {
  Resource,
  component$,
  useResource$,
  useSignal,
} from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import { getData } from '~/server/auctions';
import type { Auction } from '~/types';
import AppPagination from '~/components/shared/AppPagination';
import AuctionCard from '~/components/auctions/AuctionCard';
import EmptyFilter from '~/components/shared/EmptyFilter';
import Filters from '~/components/auctions/Filters';

export default component$(() => {
  const query = useSignal(useLocation().url.search);

  const data = useResource$(async () => {
    return await getData(query.value);
  });

  return (
    <>
      <Resource
        value={data}
        onPending={() => <h3>Loading</h3>}
        onResolved={(data) =>
          data.totalCount ? (
            <>
              <Filters />
              <div class='grid grid-cols-4 gap-6'>
                {data.results.map((auction: Auction) => (
                  <AuctionCard key={auction.id} auction={auction} />
                ))}
              </div>
              <div class='flex justify-center'>
                <AppPagination currentPage={2} pageCount={5} />
              </div>
            </>
          ) : (
            <EmptyFilter showReset />
          )
        }
      />
    </>
  );
});
