import type { HoldingWithPerformance } from "../../hooks/usePortfolioHoldings";

type AssetCardProps = {
  holding: HoldingWithPerformance;
};

export const AssetCard = ({ holding }: AssetCardProps) => {
  const isPositive = holding.gainLoss >= 0;
  const gainLossColorClass = isPositive ? "text-green-500" : "text-red-500";
  const gainLossPrefix = isPositive ? "+" : "";

  return (
    <div className="flex min-w-60 flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition hover:border-slate-700">
      {/* Header: Logo + Symbol */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20 text-sm font-bold text-indigo-300">
          {holding.symbol.slice(0, 2)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-100">
            {holding.symbol}
          </p>
          <p className="truncate text-xs text-slate-400">{holding.name}</p>
        </div>
      </div>

      {/* Price */}
      <div>
        <p className="text-xs text-slate-400">Current Price</p>
        <p className="text-xl font-bold text-slate-50">
          $
          {holding.currentPrice.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </div>

      {/* Gain/Loss */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400">Gain/Loss</p>
          <p className={`text-sm font-semibold ${gainLossColorClass}`}>
            {gainLossPrefix}
            {holding.gainLossPercent.toFixed(1)}%
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">Units</p>
          <p className="text-sm font-medium text-slate-200">
            {holding.quantity}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssetCard;
