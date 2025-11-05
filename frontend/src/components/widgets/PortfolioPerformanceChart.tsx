import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { usePortfolioHistory } from "../../hooks/usePortfolioHistory";

/**
 * NOTE: This component uses mock historical data via usePortfolioHistory.
 * The backend portfolioService does not currently store historical portfolio snapshots.
 * Future enhancement: Add portfolio_history table and tracking to portfolioService.
 */

const timeFilters = ["1D", "1W", "1M", "6M", "1Y"] as const;

const SkeletonLoader = () => (
  <div className="animate-pulse space-y-4">
    <div className="flex items-center justify-between">
      <div className="h-6 w-48 rounded bg-slate-800"></div>
      <div className="flex gap-2">
        {timeFilters.map((filter) => (
          <div key={filter} className="h-9 w-12 rounded-lg bg-slate-800"></div>
        ))}
      </div>
    </div>
    <div className="h-80 rounded-lg bg-slate-800/50"></div>
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
        <p className="font-medium text-red-200">Error Loading Chart</p>
        <p className="text-sm text-red-300/80">{message}</p>
      </div>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="flex h-80 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/50">
    <div className="text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="mx-auto h-12 w-12 text-slate-600"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
        />
      </svg>
      <p className="mt-4 text-sm font-medium text-slate-400">
        No portfolio data available
      </p>
      <p className="mt-1 text-xs text-slate-500">
        Add assets to your portfolio to see performance
      </p>
    </div>
  </div>
);

// Custom Tooltip Component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border border-slate-700 bg-slate-800/95 px-4 py-3 shadow-xl backdrop-blur-sm">
        <p className="text-xs font-medium text-slate-400">{data.timestamp}</p>
        <p className="mt-1 text-lg font-semibold text-slate-100">
          ${data.value.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </div>
    );
  }
  return null;
};

interface PortfolioPerformanceChartProps {
  className?: string;
}

export const PortfolioPerformanceChart = ({
  className = "",
}: PortfolioPerformanceChartProps) => {
  const { data, isLoading, isError, error } = usePortfolioHistory();

  // Force proper grid span by ensuring the className is always applied
  const containerClassName = `rounded-2xl border border-slate-800 bg-slate-900/80 p-6 ${className}`.trim();

  // Show loading skeleton
  if (isLoading) {
    return (
      <div className={containerClassName}>
        <SkeletonLoader />
      </div>
    );
  }

  // Show error state
  if (isError) {
    return (
      <div className={containerClassName}>
        <ErrorState
          message={error?.message || "Could not load portfolio history"}
        />
      </div>
    );
  }

  // Show empty state
  if (!data || data.length === 0) {
    return (
      <div className={containerClassName}>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-100">
            Portfolio Performance
          </h2>
        </div>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className={containerClassName}>
      {/* Header with Title and Time Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-slate-100">
          Portfolio Performance
        </h2>

        {/* Time Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {timeFilters.map((filter, index) => (
            <button
              key={filter}
              type="button"
              className={[
                "rounded-lg px-4 py-2 text-sm font-medium transition",
                index === 2 // Highlight "1M" by default
                  ? "bg-indigo-500/20 text-indigo-200 ring-1 ring-inset ring-indigo-400"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white",
              ].join(" ")}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Chart - wrapped in div to ensure proper width calculation */}
      <div className="w-full min-w-0">
        <ResponsiveContainer width="100%" height={320} debounce={1}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#334155"
            strokeOpacity={0.3}
            vertical={false}
          />

          <XAxis
            dataKey="date"
            stroke="#64748b"
            style={{ fontSize: "12px" }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
            minTickGap={30}
          />

          <YAxis
            stroke="#64748b"
            style={{ fontSize: "12px" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) =>
              `$${(value / 1000).toFixed(0)}k`
            }
            width={45}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#6366f1", strokeWidth: 1 }} />

          <Area
            type="monotone"
            dataKey="value"
            stroke="#6366f1"
            strokeWidth={2}
            fill="url(#colorValue)"
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PortfolioPerformanceChart;
