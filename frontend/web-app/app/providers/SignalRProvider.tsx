'use client';
import { PropsWithChildren, useEffect, useState } from 'react';
import { User } from 'next-auth';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import toast from 'react-hot-toast';
import { useAuctionStore } from '@/app/hooks/useAuctionStore';
import { useBidStore } from '@/app/hooks/useBidStore';
import AuctionCreatedToast from '@/app/components/AuctionCreatedToast';
import { Auction, AuctionFinished, Bid } from '@/types';
import { getDetailedViewData } from '@/app/actions/auctionActions';
import AuctionFinishedToast from '@/app/components/AuctionFinishedToast';

type Props = {
  user: User | null;
};

export default function SignalRProvider({
  children,
  user,
}: PropsWithChildren<Props>) {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const setCurrentPrice = useAuctionStore((state) => state.setCurrentPrice);
  const addBid = useBidStore((state) => state.addBid);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(process.env.NEXT_PUBLIC_NOTIFY_URL!)
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          connection.on('BidPlaced', (bid: Bid) => {
            if (bid.bidStatus.includes('Accepted')) {
              setCurrentPrice(bid.auctionId, bid.amount);
            }

            addBid(bid);
          });

          connection.on('AuctionCreated', (auction: Auction) => {
            if (user?.username !== auction.seller) {
              return toast(<AuctionCreatedToast auction={auction} />, {
                duration: 10000,
              });
            }
          });

          connection.on(
            'AuctionFinished',
            (finishedAuction: AuctionFinished) => {
              const auction = getDetailedViewData(finishedAuction.auctionId);
              return toast.promise(
                auction,
                {
                  loading: 'Loading',
                  success: (auction) => (
                    <AuctionFinishedToast
                      finishedAuction={finishedAuction}
                      auction={auction}
                    />
                  ),
                  error: (err) => 'Auction finished',
                },
                { success: { duration: 10000, icon: null } }
              );
            }
          );
        })
        .catch((error) => console.log(error));
    }

    return () => {
      connection?.stop();
    };
  }, [connection, setCurrentPrice, user, addBid]);

  return children;
}
