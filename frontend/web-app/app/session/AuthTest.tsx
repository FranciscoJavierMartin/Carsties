'use client';

import React, { useState } from 'react';
import { updateAuctionTest } from '../actions/auctionActions';
import { Button } from 'flowbite-react';

export default function AuthTest() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any>();

  function doUpdate() {
    setResult(undefined);

    setIsLoading(true);
    updateAuctionTest()
      .then((res) => setResult(res))
      .finally(() => setIsLoading(false));
  }

  return (
    <div className='flex items-center gap-4'>
      <Button outline isProcessing={isLoading} onClick={doUpdate}>
        Test auth
      </Button>
      <div>{JSON.stringify(result, null, 2)}</div>
    </div>
  );
}
