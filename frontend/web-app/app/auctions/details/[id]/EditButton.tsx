'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from 'flowbite-react';

type Props = {
  id: string;
};

export default function EditButton({ id }: Props) {
  return (
    <Button outline>
      <Link href={`/auctions/update/${id}`}>Update auction</Link>
    </Button>
  );
}
