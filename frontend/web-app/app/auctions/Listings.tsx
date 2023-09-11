'use client';

import React, { useEffect, useState } from 'react';
import { shallow } from 'zustand/shallow';
import qs from 'query-string';
import { Auction, PagedResult } from '@/types';
import AppPagination from '@/app/components/AppPagination';
import { getData } from '@/app/actions/auctionActions';
import Filters from '@/app/auctions/Filters';
import { useParamsStore } from '@/app/hooks/useParamsStore';
import { useAuctionStore } from '@/app/hooks/useAuctionStore';
import EmptyFilter from '@/app/components/EmptyFilter';
import AuctionCard from '@/app/auctions/AuctionCard';

export default function Listings() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const params = useParamsStore(
    (state) => ({
      pageNumber: state.pageNumber,
      pageSize: state.pageSize,
      searchTerm: state.searchTerm,
      orderBy: state.orderBy,
      filterBy: state.filterBy,
      seller: state.seller,
      winner: state.winner,
    }),
    shallow
  );
  const setParams = useParamsStore((state) => state.setParams);
  const data = useAuctionStore(
    (state) => ({
      auctions: state.auctions,
      totalCount: state.totalCount,
      pageCount: state.pageCount,
    }),
    shallow
  );
  const setData = useAuctionStore((state) => state.setData);
  const url = qs.stringifyUrl({ url: '', query: params });

  function setPageNumber(pageNumber: number): void {
    setParams({ pageNumber });
  }

  useEffect(() => {
    getData(url).then((data: PagedResult<Auction>) => {
      setData(data);
      setIsLoading(false);
    });
  }, [url]);

  return isLoading ? (
    <h3>Loading...</h3>
  ) : data.totalCount ? (
    <>
      <Filters />
      <div className='grid grid-cols-4 gap-6'>
        {data.auctions.map((auction: Auction) => (
          <AuctionCard key={auction.id} auction={auction} />
        ))}
      </div>
      <div className='flex justify-center'>
        <AppPagination
          currentPage={params.pageNumber}
          pageCount={data.pageCount}
          pageChanged={setPageNumber}
        />
      </div>
    </>
  ) : (
    <EmptyFilter showReset />
  );
}
