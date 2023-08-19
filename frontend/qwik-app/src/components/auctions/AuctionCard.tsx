import { component$ } from '@builder.io/qwik';
import type { Auction } from '~/types';
import CarImage from '~/components/auctions/CarImage';

type AuctionCardProps = {
  auction: Auction;
};
export default component$<AuctionCardProps>(({ auction }) => {
  return (
    <a href='#' class='group'>
      <div class='w-full bg-gray-200 aspect-w-16 aspect-h-10 rounded-lg overflow-hidden'>
        <div>
          <CarImage imageUrl={auction.imageUrl} />
          <div class='absolute bottom-2 left-2'></div>
        </div>
      </div>
      <div class='flex justify-between items-center mt-4'>
        <h3 class='text-gray-700'>
          {auction.make} {auction.model}
        </h3>
        <p class='font-semibold text-sm'>{auction.year}</p>
      </div>
    </a>
  );
});
