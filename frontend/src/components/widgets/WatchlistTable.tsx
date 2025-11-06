import { useState } from "react";
import { useWatchlist } from "../../hooks/useWatchlist";

/**
 * NOTE: This component uses mock data via useWatchlist.
 * The backend portfolioService does not currently have a Watchlist entity.
 * Future enhancement: Add Watchlist table and CRUD endpoints to portfolioService.
 */

type FilterTab = "Most Viewed" | "Gainers" | "Losers";

type WatchlistTableProps = {
  className?: string;
};

export const WatchlistTable = ({ className = "" }: WatchlistTableProps) => {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("Most Viewed");
  const { watchlist, isLoading, isError } = useWatchlist();

  // Filter watchlist based on active tab
  const filteredWatchlist = watchlist.filter((item) => {
    if (activeFilter === "Gainers") return item.changePercent > 0;
    if (activeFilter === "Losers") return item.changePercent < 0;
    return true;
  });

  // Sort by volume for "Most Viewed" (simulating view count with volume)
  const sortedWatchlist = [...filteredWatchlist].sort((a, b) => {
    if (activeFilter === "Most Viewed") return b.volume - a.volume;
    if (activeFilter === "Gainers") return b.changePercent - a.changePercent;
    if (activeFilter === "Losers") return a.changePercent - b.changePercent;
    return 0;
  });

  return (
    <div
      className={`rounded-2xl border border-slate-800 bg-black p-6 ${className}`}
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-100">Watchlist</h2>

        {/* Filter Tabs */}
        <div className="flex gap-2 rounded-lg bg-slate-800/50 p-1">
          {(["Most Viewed", "Gainers", "Losers"] as FilterTab[]).map(
            (filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`flex-1 rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                  activeFilter === filter
                    ? "bg-slate-700 text-slate-100"
                    : "text-slate-400 hover:text-slate-300"
                }`}
              >
                {filter}
              </button>
            )
          )}
        </div>
      </div>

      {/* Error State */}
      {isError && (
        <div className="rounded-lg bg-red-500/10 p-4 text-center text-sm text-red-400">
          Failed to load watchlist. Please try again later.
        </div>
      )}

      {/* Loading State - Skeleton Rows */}
      {isLoading && (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between border-b border-slate-800/50 pb-4"
            >
              <div className="flex-1">
                <div className="mb-2 h-4 w-20 animate-pulse rounded bg-slate-800" />
                <div className="h-3 w-32 animate-pulse rounded bg-slate-800" />
              </div>
              <div className="text-right">
                <div className="mb-2 h-4 w-16 animate-pulse rounded bg-slate-800" />
                <div className="h-3 w-12 animate-pulse rounded bg-slate-800" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && sortedWatchlist.length === 0 && (
        <div className="py-8 text-center">
          <p className="text-sm text-slate-400">Your watchlist is empty</p>
          <p className="mt-1 text-xs text-slate-500">
            Add stocks to track their performance
          </p>
        </div>
      )}

      {/* Data Table */}
      {!isLoading && !isError && sortedWatchlist.length > 0 && (
        <div className="space-y-4">
          {sortedWatchlist.map((item) => {
            const isPositive = item.changePercent > 0;

            return (
              <div
                key={item.id}
                className="flex items-center justify-between border-b border-slate-800/50 pb-4 transition-colors last:border-b-0 hover:bg-slate-800/20"
              >
                {/* Stock Info */}
                <div className="flex-1">
                  <div className="font-medium text-slate-100">
                    {item.symbol}
                  </div>
                  <div className="text-xs text-slate-400">{item.name}</div>
                </div>

                {/* Price & Change */}
                <div className="text-right">
                  <div className="font-medium text-slate-100">
                    ${item.currentPrice.toFixed(2)}
                  </div>
                  <div
                    className={`text-xs font-medium ${
                      isPositive ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {isPositive ? "+" : ""}
                    {item.changePercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
