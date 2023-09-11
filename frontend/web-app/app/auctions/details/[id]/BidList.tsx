'use client';
import React, { useEffect, useState } from 'react';
import { User } from 'next-auth';
import toast from 'react-hot-toast';
import { getBidsForAuction } from '@/app/actions/auctionActions';
import Heading from '@/app/components/Heading';
import { useBidStore } from '@/app/hooks/useBidStore';
import { Auction, Bid } from '@/types';
import BidItem from '@/app/auctions/details/[id]/BidItem';

type Props = {
  user: User|null;
  auction: Auction;
};

export default function BidList({ user, auction }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const bids = useBidStore((state) => state.bids);
  const setBids = useBidStore((state) => state.setBids);

  useEffect(() => {
    getBidsForAuction(auction.id)
      .then((res: any) => {
        if (res.error) {
          throw res.error;
        }

        setBids(res as Bid[]);
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => setIsLoading(false));
  }, [auction.id, setBids, setIsLoading]);

  return isLoading ? (
    <span>Loading bids...</span>
  ) : (
    <div className='border-2 rounded-lg p-2 bg-gray-200'>
      <Heading title='Bids' />
      {bids.map((bid) => (
        <BidItem bid={bid} key={bid.id} />
      ))}
    </div>
  );
}
