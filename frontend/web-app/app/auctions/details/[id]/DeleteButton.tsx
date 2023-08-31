'use client';

import React, { useState } from 'react';
import { Button } from 'flowbite-react';
import { useRouter } from 'next/navigation';
import { deleteAuction } from '@/app/actions/auctionActions';
import { toast } from 'react-hot-toast';

type Props = {
  id: string;
};

export default function DeleteButton({ id }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  function doDelete() {
    setIsLoading(true);

    deleteAuction(id)
      .then((res) => {
        if (res.error) {
          throw res.error;
        }
        setIsLoading(false);
        router.push('/');
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error(`${error.status} ${error.message}`);
      });
  }

  return (
    <Button color='failure' isProcessing={isLoading} onClick={doDelete}>
      Delete auction
    </Button>
  );
}
