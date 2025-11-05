import { Link } from "react-router-dom";
import { usePortfolioHoldings } from "../../hooks/usePortfolioHoldings";
import { AssetCard } from "./AssetCard";

type MyPortfolioCarouselProps = {
  className?: string;
};

const SkeletonLoader = () => (
  <div className="flex gap-4 overflow-x-auto pb-2">
    {[1, 2, 3, 4].map((i) => (
      <div
        key={i}
        className="min-w-60 animate-pulse rounded-xl border border-slate-800 bg-slate-900/60 p-4"
      >
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-slate-800"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 w-16 rounded bg-slate-800"></div>
              <div className="h-3 w-24 rounded bg-slate-800"></div>
            </div>
          </div>
          <div className="h-8 w-28 rounded bg-slate-800"></div>
          <div className="flex justify-between">
            <div className="h-6 w-16 rounded bg-slate-800"></div>
            <div className="h-6 w-16 rounded bg-slate-800"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const ErrorState = () => (
  <div className="flex items-center justify-center rounded-xl border border-red-900/50 bg-red-950/20 p-6">
    <p className="text-sm text-red-300">Failed to load portfolio holdings</p>
  </div>
);

export const MyPortfolioCarousel = ({
  className = "",
}: MyPortfolioCarouselProps) => {
  const { holdings, isLoading, isError } = usePortfolioHoldings();

  return (
    <div
      className={`rounded-2xl border border-slate-800 bg-slate-900/80 p-6 ${className}`}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-100">My Portfolio</h2>
        <Link
          to="/portfolio"
          className="text-sm font-medium text-indigo-400 transition hover:text-indigo-300"
        >
          See All →
        </Link>
      </div>

      {/* Content */}
      {isLoading && <SkeletonLoader />}

      {isError && <ErrorState />}

      {!isLoading && !isError && holdings.length > 0 && (
        <div className="scrollbar-hide -mx-2 flex gap-4 overflow-x-auto px-2 pb-2">
          {holdings.map((holding) => (
            <AssetCard key={holding.id} holding={holding} />
          ))}
        </div>
      )}

      {!isLoading && !isError && holdings.length === 0 && (
        <div className="flex items-center justify-center rounded-xl border border-slate-800 bg-slate-900/40 p-8">
          <div className="text-center">
            <p className="text-sm font-medium text-slate-300">
              No holdings yet
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Add your first investment to get started
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPortfolioCarousel;
