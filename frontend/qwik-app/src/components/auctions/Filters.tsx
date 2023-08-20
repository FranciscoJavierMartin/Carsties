import { component$ } from '@builder.io/qwik';
import { BsStopwatchFill, BsStopCircleFill } from '@qwikest/icons/bootstrap';
import {
  HiFireMini,
  HiShieldExclamationMini,
  HiClockOutline,
} from '@qwikest/icons/heroicons';
import SortAscending from '~/components/icons/SortAscending';

const orderButtons = [
  {
    label: 'Alphabetical',
    icon: SortAscending,
    value: 'make',
  },
  {
    label: 'End date',
    icon: HiClockOutline,
    value: 'endingSoon',
  },
  {
    label: 'Recently added',
    icon: BsStopCircleFill,
    value: 'new',
  },
];

const filterButtons = [
  {
    label: 'Live auctions',
    icon: HiFireMini,
    value: 'live',
  },
  {
    label: 'Ending < 6 hours',
    icon: HiShieldExclamationMini,
    value: 'endingSoon',
  },
  {
    label: 'Completed',
    icon: BsStopwatchFill,
    value: 'finished',
  },
];

export default component$(() => {
  const filterBy = 'live';
  const orderBy = 'make';

  return (
    <div class='flex justify-between items-center mb-4'>
      <div>
        <span class='uppercase text-sm text-gray-500 mr-2'>Filter by</span>
        <div class='inline-flex rounded-md shadow-sm' role='group'>
          {filterButtons.map(({ label, icon: Icon, value }, index: number) => (
            <button
              key={value}
              class={[
                'inline-flex',
                'items-center',
                'px-4',
                'py-2',
                'text-sm',
                'font-medium',
                'text-gray-900',
                'bg-white',
                'border-gray-200',
                'hover:bg-gray-100',
                'focus:z-10',
                'focus:ring-2',
                'first-of-type:rounded-l-lg',
                'last-of-type:rounded-r-md',
                index === 0 || index === filterButtons.length - 1
                  ? 'border'
                  : 'border-t border-b',
                {
                  'text-red-900 border-red-300 enabled:hover:bg-red-100 focus:ring-4 focus:ring-red-300 :bg-red-600 focus:text-red-900':
                    filterBy === value,
                },
              ]}
            >
              <Icon class='mr-3 h-4 w-4' />
              {label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <span class='uppercase text-sm text-gray-500 mr-2'>Order by</span>
        <div class='inline-flex rounded-md shadow-sm' role='group'>
          {orderButtons.map(({ label, icon: Icon, value }, index: number) => (
            <button
              key={value}
              class={[
                'inline-flex',
                'items-center',
                'px-4',
                'py-2',
                'text-sm',
                'font-medium',
                'text-gray-900',
                'bg-white',
                'border-gray-200',
                'hover:bg-gray-100',
                'hover:cyan-blue-700',
                'focus:z-10',
                'focus:ring-2',
                'first-of-type:rounded-l-lg',
                'last-of-type:rounded-r-md',
                index === 0 || index === filterButtons.length - 1
                  ? 'border'
                  : 'border-t border-b',
                {
                  'text-red-900 border-red-300 enabled:hover:bg-red-100 focus:ring-4 focus:ring-red-300 :bg-red-600 focus:text-red-900':
                    orderBy === value,
                },
              ]}
            >
              <Icon class='mr-3 h-4 w-4' />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});