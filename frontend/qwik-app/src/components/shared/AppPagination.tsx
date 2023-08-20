import { component$ } from '@builder.io/qwik';

type AppPaginationProps = {
  currentPage: number;
  pageCount: number;
};

export default component$<AppPaginationProps>(
  ({ currentPage = 3, pageCount = 5 }) => {
    return (
      <nav aria-label='pagination'>
        <ul class='inline-flex -space-x-px text-sm'>
          <li>
            <button
              disabled={currentPage === 1}
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
                hover:bg-gray-100 
                hover:text-gray-700
              '
            >
              Previous
            </button>
          </li>
          {[...Array(pageCount)].map((_, i) => {
            const isCurrentPage = i + 1 === currentPage;
            return (
              <li key={i}>
                <button
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
                    isCurrentPage
                      ? 'hover:text-blue-700'
                      : 'hover:text-gray-700',
                  ]}
                >
                  {i + 1}
                </button>
              </li>
            );
          })}
          <li>
            <button
              disabled={currentPage === pageCount}
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
                hover:bg-gray-100 
                hover:text-gray-700'
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    );
  }
);
