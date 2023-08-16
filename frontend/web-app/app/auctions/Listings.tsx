'use client';

import React, { useEffect, useState } from 'react';
import AuctionCard from './AuctionCard';
import { Auction, PagedResult } from '@/types';
import AppPagination from '@/app/components/AppPagination';
import { getData } from '@/app/actions/auctionActions';
import Filters from '@/app/auctions/Filters';

export default function Listings() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(4);

  useEffect(() => {
    getData(pageNumber, pageSize).then((data: PagedResult<Auction>) => {
      setAuctions(data.results);
      setPageCount(data.pageCount);
    });
  }, [pageNumber, pageSize]);

  return auctions.length ? (
    <>
      <Filters pageSize={pageSize} setPageSize={setPageSize} />
      <div className='grid grid-cols-4 gap-6'>
        {auctions.map((auction: Auction) => (
          <AuctionCard key={auction.id} auction={auction} />
        ))}
      </div>
      <div className='flex justify-center'>
        <AppPagination
          currentPage={1}
          pageCount={pageCount}
          pageChanged={setPageNumber}
        />
      </div>
    </>
  ) : (
    <h3>Loading...</h3>
  );
}
