export type WatchlistItem = {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  changePercent: number;
  volume: number;
};

export type UseWatchlistReturn = {
  watchlist: WatchlistItem[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
};

/**
 * Custom hook to fetch watchlist items
 * TODO: Replace mock data with actual API calls to portfolioService
 */
export const useWatchlist = (): UseWatchlistReturn => {
  // Mock data - replace with actual API calls in future phases
  const mockWatchlist: WatchlistItem[] = [
    {
      id: "1",
      symbol: "SPOT",
      name: "Spotify Technology S.A.",
      currentPrice: 178.45,
      changePercent: 2.34,
      volume: 1250000,
    },
    {
      id: "2",
      symbol: "AMZN",
      name: "Amazon.com Inc.",
      currentPrice: 178.35,
      changePercent: -0.87,
      volume: 45600000,
    },
    {
      id: "3",
      symbol: "NVDA",
      name: "NVIDIA Corp.",
      currentPrice: 875.28,
      changePercent: 3.21,
      volume: 38900000,
    },
    {
      id: "4",
      symbol: "META",
      name: "Meta Platforms Inc.",
      currentPrice: 485.92,
      changePercent: 1.45,
      volume: 12800000,
    },
  ];

  return {
    watchlist: mockWatchlist,
    isLoading: false,
    isError: false,
    error: null,
  };
};

export default useWatchlist;
