import {
  Resource,
  component$,
  useContext,
  useResource$,
} from '@builder.io/qwik';
import { getData } from '~/server/auctions';
import type { Auction, PagedResult } from '~/types';
import AppPagination from '~/components/shared/AppPagination';
import AuctionCard from '~/components/auctions/AuctionCard';
import EmptyFilter from '~/components/shared/EmptyFilter';
import Filters from '~/components/auctions/Filters';
import { searchContext } from '~/store/searchAuctions';

export default component$(() => {
  const searchStore = useContext(searchContext);

  const data = useResource$<PagedResult<Auction>>(async ({ track }) => {
    track(() => [
      searchStore.filterBy,
      searchStore.orderBy,
      searchStore.pageNumber,
      searchStore.pageSize,
      searchStore.searchTerm,
    ]);

    let queryString = `?orderBy=${searchStore.orderBy}&filterBy=${searchStore.filterBy}&pageSize=${searchStore.pageSize}&pageNumber=${searchStore.pageNumber}`;

    if (searchStore.searchTerm) {
      queryString += `&searchTerm=${searchStore.searchTerm}`;
    }

    const result: PagedResult<Auction> = await getData(queryString);

    searchStore.pageCount = result.pageCount;

    return result;
  });

  return (
    <>
      <Resource
        value={data.value}
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
                <AppPagination />
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
