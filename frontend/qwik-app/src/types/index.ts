export type PagedResult<T> = {
  results: T[];
  pageCount: number;
  totalCount: number;
};

export type Auction = {
  reservePrice: number;
  seller: string;
  winner: any;
  soldAmount: number;
  currentHighBid: number;
  createdAt: string;
  updatedAt: string;
  auctionEnd: string;
  status: string;
  make: string;
  model: string;
  year: number;
  color: string;
  mileage: number;
  imageUrl: string;
  id: string;
};

export type SearchAuctionsState = {
  pageNumber: number;
  pageSize: number;
  pageCount: number;
  searchTerm: string;
  searchValue: string;
  orderBy: string;
  filterBy: string;
};

export type SearchAuctionsActions = {
  setParams: (params: Partial<SearchAuctionsState>) => void;
  reset: () => void;
  setSearchValue: (value: string) => void;
};

export type SearchAuctionsStore = SearchAuctionsState & SearchAuctionsActions;
