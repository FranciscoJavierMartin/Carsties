import {
  Resource,
  component$,
  useResource$,
  useSignal,
} from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import { getData } from '~/server/auctions';
import type { Auction } from '~/types';
import AuctionCard from '~/components/auctions/AuctionCard';
import EmptyFilter from '~/components/shared/EmptyFilter';

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
              <div class='grid grid-cols-4 gap-6'>
                {data.results.map((auction: Auction) => (
                  <AuctionCard key={auction.id} auction={auction} />
                ))}
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
