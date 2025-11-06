import { useMemo } from "react";
import { usePortfolioHoldings } from "../../hooks/usePortfolioHoldings";
import { getAllHoldings } from "../../api/portfolioService";
import { useState, useEffect } from "react";

type AssetTypeSummary = {
  type: string;
  icon: string;
  totalValue: number;
  totalInvested: number;
  gainLoss: number;
  gainLossPercent: number;
  count: number;
};

export const AssetTypeSummaryCards = () => {
  const [summaries, setSummaries] = useState<AssetTypeSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSummaries = async () => {
      try {
        const { stocks, mutualFunds, cryptos, manuals } = await getAllHoldings();
        
        const assetSummaries: AssetTypeSummary[] = [];

        // Stocks Summary
        if (stocks.length > 0) {
          const stocksInvested = stocks.reduce((sum, s) => sum + (s.quantity * s.purchasePrice), 0);
          const stocksCurrent = stocks.reduce((sum, s) => sum + (s.quantity * s.purchasePrice * 1.05), 0); // Mock 5% gain
          assetSummaries.push({
            type: "Stocks",
            icon: "📈",
            totalValue: stocksCurrent,
            totalInvested: stocksInvested,
            gainLoss: stocksCurrent - stocksInvested,
            gainLossPercent: ((stocksCurrent - stocksInvested) / stocksInvested) * 100,
            count: stocks.length,
          });
        }

        // Crypto Summary
        if (cryptos.length > 0) {
          const cryptoInvested = cryptos.reduce((sum, c) => sum + (c.quantity * c.purchasePrice), 0);
          const cryptoCurrent = cryptos.reduce((sum, c) => sum + (c.quantity * c.purchasePrice * 1.10), 0); // Mock 10% gain
          assetSummaries.push({
            type: "Crypto",
            icon: "💰",
            totalValue: cryptoCurrent,
            totalInvested: cryptoInvested,
            gainLoss: cryptoCurrent - cryptoInvested,
            gainLossPercent: ((cryptoCurrent - cryptoInvested) / cryptoInvested) * 100,
            count: cryptos.length,
          });
        }

        // Mutual Funds Summary
        if (mutualFunds.length > 0) {
          const mfInvested = mutualFunds.reduce((sum, m) => sum + (m.quantity * m.purchasePrice), 0);
          const mfCurrent = mutualFunds.reduce((sum, m) => sum + (m.quantity * m.purchasePrice * 1.03), 0); // Mock 3% gain
          assetSummaries.push({
            type: "Mutual Funds",
            icon: "📊",
            totalValue: mfCurrent,
            totalInvested: mfInvested,
            gainLoss: mfCurrent - mfInvested,
            gainLossPercent: ((mfCurrent - mfInvested) / mfInvested) * 100,
            count: mutualFunds.length,
          });
        }

        // Gold Summary
        const goldHoldings = manuals?.filter(m => m.assetType === "Gold") || [];
        if (goldHoldings.length > 0) {
          const goldInvested = goldHoldings.reduce((sum, g) => sum + g.investedValue, 0);
          const goldCurrent = goldHoldings.reduce((sum, g) => sum + g.currentValue, 0);
          assetSummaries.push({
            type: "Gold",
            icon: "💎",
            totalValue: goldCurrent,
            totalInvested: goldInvested,
            gainLoss: goldCurrent - goldInvested,
            gainLossPercent: ((goldCurrent - goldInvested) / goldInvested) * 100,
            count: goldHoldings.length,
          });
        }

        // Real Estate Summary
        const reHoldings = manuals?.filter(m => m.assetType === "Real Estate") || [];
        if (reHoldings.length > 0) {
          const reInvested = reHoldings.reduce((sum, r) => sum + r.investedValue, 0);
          const reCurrent = reHoldings.reduce((sum, r) => sum + r.currentValue, 0);
          assetSummaries.push({
            type: "Real Estate",
            icon: "🏠",
            totalValue: reCurrent,
            totalInvested: reInvested,
            gainLoss: reCurrent - reInvested,
            gainLossPercent: ((reCurrent - reInvested) / reInvested) * 100,
            count: reHoldings.length,
          });
        }

        setSummaries(assetSummaries);
      } catch (error) {
        console.error("Error fetching asset summaries:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummaries();
  }, []);

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="min-w-60 animate-pulse rounded-xl border border-slate-800 bg-black p-6"
          >
            <div className="h-32 bg-slate-800 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
      {summaries.map((summary) => {
        const isPositive = summary.gainLoss >= 0;
        const colorClass = isPositive ? "text-green-500" : "text-red-500";
        const prefix = isPositive ? "+" : "";

        return (
          <div
            key={summary.type}
            className="min-w-60 flex-shrink-0 rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-900/50 p-6 transition hover:border-slate-700"
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <span className="text-3xl">{summary.icon}</span>
                <span className="text-xs font-medium text-slate-400">
                  {summary.count} {summary.count === 1 ? "asset" : "assets"}
                </span>
              </div>

              {/* Asset Type */}
              <h3 className="text-lg font-semibold text-slate-100">
                {summary.type}
              </h3>

              {/* Current Value */}
              <div>
                <p className="text-xs text-slate-400">Current Value</p>
                <p className="text-2xl font-bold text-slate-50">
                  ₹{summary.totalValue.toLocaleString("en-IN", {
                    maximumFractionDigits: 0,
                  })}
                </p>
              </div>

              {/* Gain/Loss */}
              <div className="flex items-center justify-between border-t border-slate-800 pt-3">
                <div>
                  <p className="text-xs text-slate-400">Gain/Loss</p>
                  <p className={`text-sm font-semibold ${colorClass}`}>
                    {prefix}₹{Math.abs(summary.gainLoss).toLocaleString("en-IN", {
                      maximumFractionDigits: 0,
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">%</p>
                  <p className={`text-sm font-semibold ${colorClass}`}>
                    {prefix}{summary.gainLossPercent.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
