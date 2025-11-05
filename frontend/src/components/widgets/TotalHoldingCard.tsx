import { useTotalPortfolioValue } from "../../hooks/useTotalPortfolioValue";

const timeFilters = ["1D", "1W", "1M", "6M", "1Y", "5Y"] as const;

const SkeletonLoader = () => (
  <div className="animate-pulse space-y-6">
    <div className="space-y-2">
      <div className="h-6 w-40 rounded bg-slate-800"></div>
      <div className="h-12 w-56 rounded bg-slate-800"></div>
    </div>
    <div className="space-y-2">
      <div className="h-4 w-32 rounded bg-slate-800"></div>
      <div className="h-8 w-48 rounded bg-slate-800"></div>
    </div>
    <div className="flex gap-2">
      {timeFilters.map((filter) => (
        <div key={filter} className="h-9 w-12 rounded-lg bg-slate-800"></div>
      ))}
    </div>
  </div>
);

const ErrorState = ({ message }: { message: string }) => (
  <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-6">
    <div className="flex items-center gap-3">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="h-6 w-6 text-red-400"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
        />
      </svg>
      <div>
        <p className="font-medium text-red-200">Error Loading Portfolio</p>
        <p className="text-sm text-red-300/80">{message}</p>
      </div>
    </div>
  </div>
);

export const TotalHoldingCard = () => {
  const { data, isLoading, isError, error } = useTotalPortfolioValue();

  // Show loading skeleton
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
        <SkeletonLoader />
      </div>
    );
  }

  // Show error state
  if (isError || !data) {
    return (
      <ErrorState
        message={error?.message || "Could not load portfolio value"}
      />
    );
  }

  const isPositiveReturn = data.returnAmount >= 0;
  const returnColorClass = isPositiveReturn ? "text-green-500" : "text-red-500";
  const returnPrefix = isPositiveReturn ? "+" : "";

  return (
    <div className="rounded-2xl border border-slate-800 bg-linear-to-br from-slate-900/90 to-slate-900/60 p-6 shadow-xl">
      <div className="space-y-6">
        {/* Welcome Header */}
        <div>
          <h2 className="text-lg font-medium text-slate-400">Welcome, Naya</h2>
        </div>

        {/* Total Value */}
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-400">Total Holdings</p>
          <p className="text-5xl font-bold text-slate-50">
            $
            {data.totalValue.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>

        {/* Return Information */}
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-400">Return (24h)</p>
          <p className={`text-2xl font-semibold ${returnColorClass}`}>
            {returnPrefix}${" "}
            {Math.abs(data.returnAmount).toLocaleString("en-US")} (
            {returnPrefix}
            {data.returnPercent.toFixed(1)}%)
          </p>
        </div>

        {/* Time Filter Buttons */}
        <div className="flex flex-wrap gap-2 pt-2">
          {timeFilters.map((filter, index) => (
            <button
              key={filter}
              type="button"
              className={[
                "rounded-lg px-4 py-2 text-sm font-medium transition",
                index === 3 // Highlight "6M" by default
                  ? "bg-indigo-500/20 text-indigo-200 ring-1 ring-inset ring-indigo-400"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white",
              ].join(" ")}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TotalHoldingCard;
