import { useState, useEffect, useMemo } from "react";
import { getAllHoldings } from "../../api/portfolioService";

type FilterTab = "All" | "Gainers" | "Losers";

type PortfolioOverviewTableProps = {
  className?: string;
};

type AssetRow = {
  assetName: string;
  assetType: string;
  investedValue: number;
  currentValue: number;
  gainLoss: number;
  gainLossPercent: number;
  allocation: number;
};

export const PortfolioOverviewTable = ({
  className = "",
}: PortfolioOverviewTableProps) => {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("All");
  const [assetRows, setAssetRows] = useState<AssetRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        
        const { stocks, mutualFunds, cryptos, manuals } = await getAllHoldings();
        const rows: AssetRow[] = [];
        let totalPortfolioValue = 0;

        // Calculate stocks
        stocks.forEach(stock => {
          const invested = stock.quantity * stock.purchasePrice;
          const current = stock.quantity * stock.purchasePrice * 1.05; // Mock 5% gain
          totalPortfolioValue += current;
          rows.push({
            assetName: stock.symbol,
            assetType: "Stocks",
            investedValue: invested,
            currentValue: current,
            gainLoss: current - invested,
            gainLossPercent: ((current - invested) / invested) * 100,
            allocation: 0, // Will calculate after
          });
        });

        // Calculate crypto
        cryptos.forEach(crypto => {
          const invested = crypto.quantity * crypto.purchasePrice;
          const current = crypto.quantity * crypto.purchasePrice * 1.10; // Mock 10% gain
          totalPortfolioValue += current;
          rows.push({
            assetName: crypto.symbol,
            assetType: "Crypto",
            investedValue: invested,
            currentValue: current,
            gainLoss: current - invested,
            gainLossPercent: ((current - invested) / invested) * 100,
            allocation: 0,
          });
        });

        // Calculate mutual funds
        mutualFunds.forEach(mf => {
          const invested = mf.quantity * mf.purchasePrice;
          const current = mf.quantity * mf.purchasePrice * 1.03; // Mock 3% gain
          totalPortfolioValue += current;
          rows.push({
            assetName: `Scheme ${mf.schemeCode}`,
            assetType: "Mutual Funds",
            investedValue: invested,
            currentValue: current,
            gainLoss: current - invested,
            gainLossPercent: ((current - invested) / invested) * 100,
            allocation: 0,
          });
        });

        // Calculate manual holdings
        if (manuals) {
          manuals.forEach(manual => {
            totalPortfolioValue += manual.currentValue;
            rows.push({
              assetName: manual.assetName,
              assetType: manual.assetType,
              investedValue: manual.investedValue,
              currentValue: manual.currentValue,
              gainLoss: manual.currentValue - manual.investedValue,
              gainLossPercent: ((manual.currentValue - manual.investedValue) / manual.investedValue) * 100,
              allocation: 0,
            });
          });
        }

        // Calculate allocation percentages
        rows.forEach(row => {
          row.allocation = (row.currentValue / totalPortfolioValue) * 100;
        });

        setAssetRows(rows);
      } catch (error) {
        console.error("Error fetching portfolio overview:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter assets based on active tab
  const filteredAssets = useMemo(() => {
    return assetRows.filter((asset) => {
      if (activeFilter === "Gainers") return asset.gainLossPercent > 0;
      if (activeFilter === "Losers") return asset.gainLossPercent < 0;
      return true;
    });
  }, [assetRows, activeFilter]);

  return (
    <div
      className={`rounded-2xl border border-slate-800 bg-black p-6 ${className}`}
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
                <th className="pb-3 font-medium">Asset Name</th>
                <th className="pb-3 font-medium text-right">Invested Value</th>
                <th className="pb-3 font-medium text-right">Current Value</th>
                <th className="pb-3 font-medium text-right">Total Gain/Loss</th>
                <th className="pb-3 font-medium text-right">% Gain/Loss</th>
                <th className="pb-3 font-medium text-right">% Allocation</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(4)].map((_, i) => (
                <tr key={i} className="border-b border-slate-800/50">
                  <td className="py-4">
                    <div className="h-4 w-24 animate-pulse rounded bg-slate-800" />
                  </td>
                  <td className="py-4 text-right">
                    <div className="ml-auto h-4 w-16 animate-pulse rounded bg-slate-800" />
                  </td>
                  <td className="py-4 text-right">
                    <div className="ml-auto h-4 w-16 animate-pulse rounded bg-slate-800" />
                  </td>
                  <td className="py-4 text-right">
                    <div className="ml-auto h-4 w-16 animate-pulse rounded bg-slate-800" />
                  </td>
                  <td className="py-4 text-right">
                    <div className="ml-auto h-4 w-12 animate-pulse rounded bg-slate-800" />
                  </td>
                  <td className="py-4 text-right">
                    <div className="ml-auto h-4 w-12 animate-pulse rounded bg-slate-800" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && filteredAssets.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-sm text-slate-400">No holdings to display</p>
        </div>
      )}

      {/* Data Table */}
      {!isLoading && !isError && filteredAssets.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800 text-left text-sm text-slate-400">
                <th className="pb-3 font-medium">Asset Name</th>
                <th className="pb-3 font-medium text-right">Invested Value</th>
                <th className="pb-3 font-medium text-right">Current Value</th>
                <th className="pb-3 font-medium text-right">Total Gain/Loss</th>
                <th className="pb-3 font-medium text-right">% Gain/Loss</th>
                <th className="pb-3 font-medium text-right">% Allocation</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((asset, index) => {
                const isPositive = asset.gainLoss >= 0;
                
                return (
                  <tr
                    key={`${asset.assetType}-${asset.assetName}-${index}`}
                    className="border-b border-slate-800/50 transition-colors hover:bg-slate-800/30"
                  >
                    <td className="py-4">
                      <div>
                        <div className="font-medium text-slate-100">
                          {asset.assetName}
                        </div>
                        <div className="text-sm text-slate-400">
                          {asset.assetType}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-right text-slate-300">
                      ₹{asset.investedValue.toLocaleString("en-IN", {
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td className="py-4 text-right text-slate-100">
                      ₹{asset.currentValue.toLocaleString("en-IN", {
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td className="py-4 text-right">
                      <span
                        className={`font-medium ${
                          isPositive ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {isPositive ? "+" : ""}₹{Math.abs(asset.gainLoss).toLocaleString("en-IN", {
                          maximumFractionDigits: 0,
                        })}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <span
                        className={`font-medium ${
                          isPositive ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {isPositive ? "+" : ""}
                        {asset.gainLossPercent.toFixed(2)}%
                      </span>
                    </td>
                    <td className="py-4 text-right text-slate-300">
                      {asset.allocation.toFixed(2)}%
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
