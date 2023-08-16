'use client';
import { Pagination } from 'flowbite-react';
import React, { useState } from 'react';

type Props = {
  currentPage: number;
  pageCount: number;
};

export default function AppPagination({ currentPage, pageCount }: Props) {
  const [pageNumber, setPageNumber] = useState<number>(currentPage);

  return (
    <Pagination
      currentPage={pageNumber}
      onPageChange={(e) => setPageNumber(e)}
      totalPages={pageCount}
      layout='pagination'
      showIcons
      className='text-blue-500 mb-5'
    />
  );
}
