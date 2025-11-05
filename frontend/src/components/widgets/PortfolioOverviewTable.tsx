import { useState } from "react";
import { usePortfolioHoldings } from "../../hooks/usePortfolioHoldings";
import { SparklineChart } from "../shared/SparklineChart";

type FilterTab = "All" | "Gainers" | "Losers";

type PortfolioOverviewTableProps = {
  className?: string;
};

export const PortfolioOverviewTable = ({
  className = "",
}: PortfolioOverviewTableProps) => {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("All");
  const { holdings, isLoading, isError } = usePortfolioHoldings();

  // Filter holdings based on active tab
  const filteredHoldings = holdings.filter((holding) => {
    if (activeFilter === "Gainers") return holding.gainLossPercent > 0;
    if (activeFilter === "Losers") return holding.gainLossPercent < 0;
    return true;
  });

  // Generate mock sparkline data for each holding
  const generateSparklineData = (basePrice: number, change: number) => {
    const days = 7;
    const data = [];
    for (let i = 0; i < days; i++) {
      const variance = Math.random() * 0.03 - 0.015; // ±1.5% variance
      const price = basePrice * (1 + (change / 100) * (i / days) + variance);
      data.push({ v: price });
    }
    return data;
  };

  return (
    <div
      className={`rounded-2xl border border-slate-800 bg-slate-900/80 p-6 ${className}`}
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-100">
          Portfolio Overview
        </h2>

        {/* Filter Tabs */}
        <div className="flex gap-2 rounded-lg bg-slate-800/50 p-1">
          {(["All", "Gainers", "Losers"] as FilterTab[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                activeFilter === filter
                  ? "bg-slate-700 text-slate-100"
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Error State */}
      {isError && (
        <div className="rounded-lg bg-red-500/10 p-4 text-center text-sm text-red-400">
          Failed to load portfolio data. Please try again later.
        </div>
      )}

      {/* Loading State - Skeleton Rows */}
      {isLoading && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800 text-left text-sm text-slate-400">
                <th className="pb-3 font-medium">Stock</th>
                <th className="pb-3 font-medium">Last Price</th>
                <th className="pb-3 font-medium">Change %</th>
                <th className="pb-3 font-medium">Market Cap</th>
                <th className="pb-3 font-medium">Volume</th>
                <th className="pb-3 font-medium">Last 7 days</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(4)].map((_, i) => (
                <tr key={i} className="border-b border-slate-800/50">
                  <td className="py-4">
                    <div className="h-4 w-24 animate-pulse rounded bg-slate-800" />
                  </td>
                  <td className="py-4">
                    <div className="h-4 w-16 animate-pulse rounded bg-slate-800" />
                  </td>
                  <td className="py-4">
                    <div className="h-4 w-16 animate-pulse rounded bg-slate-800" />
                  </td>
                  <td className="py-4">
                    <div className="h-4 w-20 animate-pulse rounded bg-slate-800" />
                  </td>
                  <td className="py-4">
                    <div className="h-4 w-20 animate-pulse rounded bg-slate-800" />
                  </td>
                  <td className="py-4">
                    <div className="h-8 w-24 animate-pulse rounded bg-slate-800" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && filteredHoldings.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-sm text-slate-400">No holdings to display</p>
        </div>
      )}

      {/* Data Table */}
      {!isLoading && !isError && filteredHoldings.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800 text-left text-sm text-slate-400">
                <th className="pb-3 font-medium">Stock</th>
                <th className="pb-3 font-medium">Last Price</th>
                <th className="pb-3 font-medium">Change %</th>
                <th className="pb-3 font-medium">Market Cap</th>
                <th className="pb-3 font-medium">Volume</th>
                <th className="pb-3 font-medium">Last 7 days</th>
              </tr>
            </thead>
            <tbody>
              {filteredHoldings.map((holding) => {
                const isPositive = holding.gainLossPercent > 0;
                const sparklineData = generateSparklineData(
                  holding.currentPrice,
                  holding.gainLossPercent
                );
                const sparklineColor = isPositive ? "#10b981" : "#ef4444";

                return (
                  <tr
                    key={holding.id}
                    className="border-b border-slate-800/50 transition-colors hover:bg-slate-800/30"
                  >
                    <td className="py-4">
                      <div>
                        <div className="font-medium text-slate-100">
                          {holding.symbol}
                        </div>
                        <div className="text-sm text-slate-400">
                          {holding.name}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-slate-100">
                      ${holding.currentPrice.toFixed(2)}
                    </td>
                    <td className="py-4">
                      <span
                        className={`font-medium ${
                          isPositive ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {isPositive ? "+" : ""}
                        {holding.gainLossPercent.toFixed(2)}%
                      </span>
                    </td>
                    <td className="py-4 text-slate-300">
                      ${(holding.currentPrice * holding.quantity * 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </td>
                    <td className="py-4 text-slate-300">
                      {(holding.quantity * 1000).toLocaleString()}
                    </td>
                    <td className="py-4">
                      <div className="w-24">
                        <SparklineChart
                          data={sparklineData}
                          color={sparklineColor}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
