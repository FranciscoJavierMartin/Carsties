import { createContextId, $ } from '@builder.io/qwik';
import type { SearchAuctionsState, SearchAuctionsStore } from '~/types';

export const searchContext =
  createContextId<SearchAuctionsStore>('searchContext');

export const initialAuctionsStore: SearchAuctionsState = {
  pageNumber: 1,
  pageSize: 12,
  pageCount: 1,
  searchTerm: '',
  searchValue: '',
  orderBy: 'make',
  filterBy: 'live',
};

export const reset = $(function (this: SearchAuctionsState): void {
  this.pageNumber = initialAuctionsStore.pageNumber;
  this.pageSize = initialAuctionsStore.pageSize;
  this.pageCount = initialAuctionsStore.pageCount;
  this.searchTerm = initialAuctionsStore.searchTerm;
  this.searchValue = initialAuctionsStore.searchValue;
  this.orderBy = initialAuctionsStore.orderBy;
  this.filterBy = initialAuctionsStore.filterBy;
});

export const setSearchValue = $(function (
  this: SearchAuctionsState,
  value: string
): void {
  this.searchValue = value;
});

export const setParams = $(function (
  this: SearchAuctionsState,
  newParams: Partial<SearchAuctionsState>
): void {
  if (newParams.pageNumber) {
    this.pageNumber = newParams.pageNumber;
  } else {
    this.pageNumber = 1;
    this.pageSize = newParams.pageSize || this.pageSize;
    this.pageCount = newParams.pageCount || this.pageCount;
    this.searchTerm = newParams.searchTerm || this.searchTerm;
    this.searchValue = newParams.searchValue || this.searchValue;
    this.orderBy = newParams.orderBy || this.orderBy;
    this.filterBy = newParams.filterBy || this.filterBy;
  }
});
