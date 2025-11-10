import { useMemo } from "react";
import { useExpenses } from "./useExpenses";
import { getAllHoldings } from "../api/portfolioService";
import { useState, useEffect } from "react";

export type Transaction = {
  id: string;
  type: "expense" | "asset";
  date: string;
  description: string;
  amount: number;
};

export type UseRecentTransactionsReturn = {
  transactions: Transaction[];
  isLoading: boolean;
};

export const useRecentTransactions = (): UseRecentTransactionsReturn => {
  const { data: expenses, isLoading: loadingExpenses } = useExpenses();
  const [holdings, setHoldings] = useState<
    Array<{ purchaseDate: string; symbol: string; quantity: number; totalCost: number; id: number }>
  >([]);
  const [loadingHoldings, setLoadingHoldings] = useState(true);

  useEffect(() => {
    const fetchHoldings = async () => {
      try {
        setLoadingHoldings(true);
        const { stocks, mutualFunds, cryptos } = await getAllHoldings();
        
        const allHoldings = [
          ...stocks.map(stock => ({
            purchaseDate: stock.purchaseDate,
            symbol: stock.symbol,
            quantity: stock.quantity,
            totalCost: stock.quantity * stock.purchasePrice,
            id: stock.id,
          })),
          ...mutualFunds.map(mf => ({
            purchaseDate: mf.purchaseDate,
            symbol: mf.schemeCode,
            quantity: mf.quantity,
            totalCost: mf.quantity * mf.purchasePrice,
            id: mf.id,
          })),
          ...cryptos.map(crypto => ({
            purchaseDate: crypto.purchaseDate,
            symbol: crypto.symbol,
            quantity: crypto.quantity,
            totalCost: crypto.quantity * crypto.purchasePrice,
            id: crypto.id,
          })),
        ];
        
        setHoldings(allHoldings);
      } catch (error) {
        console.error("Failed to fetch holdings:", error);
      } finally {
        setLoadingHoldings(false);
      }
    };

    fetchHoldings();
  }, []);

  const transactions = useMemo(() => {
    const expenseTransactions: Transaction[] =
      expenses?.map((expense) => ({
        id: expense.externalId,
        type: "expense" as const,
        date: expense.expenseDate,
        description: expense.description,
        amount: -expense.amount,
      })) || [];

    const assetTransactions: Transaction[] = holdings.map((holding) => ({
      id: `holding-${holding.id}`,
      type: "asset" as const,
      date: holding.purchaseDate,
      description: `Bought ${holding.quantity} ${holding.symbol}`,
      amount: -holding.totalCost,
    }));

    const combined = [...expenseTransactions, ...assetTransactions];

    return combined.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });
  }, [expenses, holdings]);

  return {
    transactions,
    isLoading: loadingExpenses || loadingHoldings,
  };
};
