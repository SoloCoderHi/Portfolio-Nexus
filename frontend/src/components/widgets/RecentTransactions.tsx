import { useRecentTransactions } from "../../hooks/useRecentTransactions";

interface RecentTransactionsProps {
  className?: string;
}

export const RecentTransactions = ({ className }: RecentTransactionsProps) => {
  const { transactions, isLoading } = useRecentTransactions();

  return (
    <div
      className={`rounded-2xl border border-slate-800 bg-black p-6 ${className || ""}`}
    >
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-100">
          Recent Transactions
        </h2>
        <p className="text-sm text-slate-400">
          Your latest expenses and asset purchases
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="h-10 w-10 rounded-full bg-slate-800" />
              <div className="flex-1">
                <div className="h-4 w-3/4 bg-slate-800 rounded mb-2" />
                <div className="h-3 w-1/2 bg-slate-800 rounded" />
              </div>
              <div className="h-4 w-16 bg-slate-800 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && transactions.length === 0 && (
        <div className="py-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-slate-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-slate-300">
            No transactions yet
          </h3>
          <p className="text-sm text-slate-500">
            Start by adding an expense or asset purchase
          </p>
        </div>
      )}

      {/* Transaction List */}
      {!isLoading && transactions.length > 0 && (
        <div className="space-y-3">
          {transactions.slice(0, 10).map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/50 p-3 transition-colors hover:bg-slate-900"
            >
              {/* Icon */}
              <div
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                  transaction.type === "expense"
                    ? "bg-red-500/10"
                    : "bg-blue-500/10"
                }`}
              >
                {transaction.type === "expense" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                )}
              </div>

              {/* Description and Date */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">
                  {transaction.description}
                </p>
                <p className="text-xs text-slate-500">
                  {new Date(transaction.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>

              {/* Amount */}
              <div className="flex-shrink-0">
                <p
                  className={`text-sm font-semibold ${
                    transaction.amount < 0 ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {transaction.amount < 0 ? "-" : "+"}$
                  {Math.abs(transaction.amount).toFixed(2)}
                </p>
              </div>
            </div>
          ))}

          {/* Show More Indicator */}
          {transactions.length > 10 && (
            <div className="pt-2 text-center">
              <p className="text-xs text-slate-500">
                Showing 10 of {transactions.length} transactions
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
