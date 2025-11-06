import { AssetTypeSummaryCards } from "../components/widgets/AssetTypeSummaryCards";
import { PortfolioPerformanceChart } from "../components/widgets/PortfolioPerformanceChart";
import { TotalHoldingCard } from "../components/widgets/TotalHoldingCard";
import { PortfolioOverviewTable } from "../components/widgets/PortfolioOverviewTable";
import { WatchlistTable } from "../components/widgets/WatchlistTable";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <header>
        <h1 className="text-2xl font-semibold text-slate-100">Dashboard</h1>
        <p className="text-sm text-slate-400">
          High level overview of your portfolio performance and market insights.
        </p>
      </header>

      {/* Top Row - 3 Columns Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Total Holding Card - Spans 1 column */}
        <TotalHoldingCard />

        {/* Asset Type Summary Cards - Spans 2 columns on large screens */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-slate-800 bg-black p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-slate-100">My Portfolio</h2>
              <p className="text-sm text-slate-400">Asset breakdown by type</p>
            </div>
            <AssetTypeSummaryCards />
          </div>
        </div>
      </div>

      {/* Portfolio Performance Chart - Full Width */}
      <PortfolioPerformanceChart />

      {/* Bottom Row - 3 Columns Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Portfolio Overview Table - Spans 2 columns */}
        <PortfolioOverviewTable className="lg:col-span-2" />

        {/* Watchlist Table - Spans 1 column */}
        <WatchlistTable className="lg:col-span-1" />
      </div>
    </div>
  );
};

export default Dashboard;
