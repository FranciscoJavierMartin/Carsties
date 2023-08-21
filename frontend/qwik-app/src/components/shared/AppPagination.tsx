import { component$, useContext } from '@builder.io/qwik';
import { searchContext } from '~/store/searchAuctions';

export default component$(() => {
  const searchStore = useContext(searchContext);

  return (
    <nav aria-label='pagination' class='mb-5'>
      {searchStore.pageCount}
      <ul class='inline-flex -space-x-px text-sm'>
        <li>
          <button
            onClick$={() => {
              searchStore.pageNumber--;
            }}
            disabled={searchStore.pageNumber === 1}
            class='
                flex 
                items-center 
                justify-center 
                px-3 
                h-8 
                ml-0 
                leading-tight 
                text-gray-500 
                bg-white border 
                border-gray-300 
                rounded-l-lg 
                enabled:hover:bg-gray-100 
                enabled:hover:text-gray-700
                enabled:cursor-pointer
              '
          >
            Previous
          </button>
        </li>
        {[...Array(searchStore.pageCount)].map((_, i) => {
          const isCurrentPage = i + 1 === searchStore.pageNumber;
          return (
            <li key={i}>
              <button
                onClick$={() => {
                  searchStore.setParams({ pageNumber: i + 1 });
                }}
                aria-current={isCurrentPage ? 'page' : undefined}
                class={[
                  'flex',
                  'items-center',
                  'justify-center',
                  'px-3',
                  'h-8',
                  'border',
                  'leading-tight',
                  'border-gray-300',
                  isCurrentPage ? 'hover:bg-blue-100' : 'hover:bg-gray-100',
                  isCurrentPage ? 'text-blue-600' : 'text-gray-500',
                  isCurrentPage ? 'bg-blue-50' : 'bg-white',
                  isCurrentPage ? 'hover:text-blue-700' : 'hover:text-gray-700',
                ]}
              >
                {i + 1}
              </button>
            </li>
          );
        })}
        <li>
          <button
            onClick$={() => {
              searchStore.pageNumber++;
            }}
            disabled={searchStore.pageNumber === searchStore.pageCount}
            class='
                flex 
                items-center 
                justify-center 
                px-3
                h-8
                leading-tight 
                text-gray-500 
                bg-white 
                border
                border-gray-300 
                rounded-r-lg 
                enabled:hover:bg-gray-100 
                enabled:hover:text-gray-700
                enabled:cursor-pointer
              '
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
});
