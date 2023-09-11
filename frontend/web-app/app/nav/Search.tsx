'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { FaSearch } from 'react-icons/fa';
import { useParamsStore } from '@/app/hooks/useParamsStore';

export default function Search() {
  const router = useRouter();
  const pathname = usePathname();
  const setParams = useParamsStore((state) => state.setParams);
  const searchValue = useParamsStore((state) => state.searchValue);
  const setSearchValue = useParamsStore((state) => state.setSearchValue);

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchValue(event.target.value);
  }

  function search() {
    if (pathname !== '/') {
      router.push('/');
    }
    setParams({ searchTerm: searchValue });
  }

  return (
    <div className='flex w-[50%] items-center border-2 rounded-full py-2 shadow-sm'>
      <input
        onChange={onChange}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') {
            search();
          }
        }}
        value={searchValue}
        placeholder='Search for cars by make, model or color'
        className='
        input-custom
        text-sm
      text-gray-600
      '
      />
      <button onClick={search}>
        <FaSearch
          size={34}
          className='bg-red-400 text-white rounded-full p-2 cursor-pointer mx-2'
        />
      </button>
    </div>
  );
}
