'use client';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { useAuctionStore } from '@/app/hooks/useAuctionStore';
import { useBidStore } from '@/app/hooks/useBidStore';
import { Bid } from '@/types';

type Props = {};

export default function SignalRProvider({
  children,
}: PropsWithChildren<Props>) {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const setCurrentPrice = useAuctionStore((state) => state.setCurrentPrice);
  const addBid = useBidStore((state) => state.addBid);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl('http://localhost:6001/notifications')
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log('Connection to notification hub');
          connection.on('BidPlaced', (bid: Bid) => {
            console.log('Bid placed event received');
            if (bid.bidStatus.includes('Accepted')) {
              setCurrentPrice(bid.auctionId, bid.amount);
            }
          });
        })
        .catch((error) => console.log(error));
    }

    return () => {
      connection?.stop();
    };
  }, [connection, setCurrentPrice]);

  return children;
}
