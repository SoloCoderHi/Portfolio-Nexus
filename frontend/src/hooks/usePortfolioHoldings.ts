import { useState, useEffect } from "react";
import { getAllHoldings } from "../api/portfolioService";
import {
  getStockPrice,
  getMutualFundPrice,
  getCryptoPrice,
} from "../api/marketDataService";

export type Holding = {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  currentPrice: number;
  averageCost: number;
  logoUrl?: string;
};

export type HoldingWithPerformance = Holding & {
  totalValue: number;
  totalCost: number;
  gainLoss: number;
  gainLossPercent: number;
};

export type UsePortfolioHoldingsReturn = {
  holdings: HoldingWithPerformance[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
};

export const usePortfolioHoldings = (): UsePortfolioHoldingsReturn => {
  const [holdings, setHoldings] = useState<HoldingWithPerformance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchHoldings = async () => {
      try {
        setIsLoading(true);
        setIsError(false);

        const { stocks, mutualFunds, cryptos } = await getAllHoldings();
        const allHoldings: HoldingWithPerformance[] = [];

        const stocksWithPrices = await Promise.all(
          stocks.map(async (stock) => {
            try {
              const price = await getStockPrice(stock.symbol);
              const currentPrice = price.current_price;
              const totalValue = stock.quantity * currentPrice;
              const totalCost = stock.quantity * stock.average_cost;
              const gainLoss = totalValue - totalCost;
              const gainLossPercent = (gainLoss / totalCost) * 100;

              return {
                id: `stock-${stock.id}`,
                symbol: stock.symbol,
                name: stock.symbol,
                quantity: stock.quantity,
                currentPrice,
                averageCost: stock.average_cost,
                totalValue,
                totalCost,
                gainLoss,
                gainLossPercent,
              };
            } catch {
              const currentPrice = stock.average_cost;
              const totalValue = stock.quantity * currentPrice;
              const totalCost = stock.quantity * stock.average_cost;
              return {
                id: `stock-${stock.id}`,
                symbol: stock.symbol,
                name: stock.symbol,
                quantity: stock.quantity,
                currentPrice,
                averageCost: stock.average_cost,
                totalValue,
                totalCost,
                gainLoss: 0,
                gainLossPercent: 0,
              };
            }
          })
        );

        const mfWithPrices = await Promise.all(
          mutualFunds.map(async (mf) => {
            try {
              const price = await getMutualFundPrice(mf.scheme_code);
              const currentPrice = price.nav;
              const totalValue = mf.quantity * currentPrice;
              const totalCost = mf.quantity * mf.average_nav;
              const gainLoss = totalValue - totalCost;
              const gainLossPercent = (gainLoss / totalCost) * 100;

              return {
                id: `mf-${mf.id}`,
                symbol: mf.scheme_code,
                name: mf.scheme_name,
                quantity: mf.quantity,
                currentPrice,
                averageCost: mf.average_nav,
                totalValue,
                totalCost,
                gainLoss,
                gainLossPercent,
              };
            } catch {
              const currentPrice = mf.average_nav;
              const totalValue = mf.quantity * currentPrice;
              const totalCost = mf.quantity * mf.average_nav;
              return {
                id: `mf-${mf.id}`,
                symbol: mf.scheme_code,
                name: mf.scheme_name,
                quantity: mf.quantity,
                currentPrice,
                averageCost: mf.average_nav,
                totalValue,
                totalCost,
                gainLoss: 0,
                gainLossPercent: 0,
              };
            }
          })
        );

        const cryptoWithPrices = await Promise.all(
          cryptos.map(async (crypto) => {
            try {
              const price = await getCryptoPrice(crypto.coin_id);
              const currentPrice = price.current_price;
              const totalValue = crypto.quantity * currentPrice;
              const totalCost = crypto.quantity * crypto.average_cost;
              const gainLoss = totalValue - totalCost;
              const gainLossPercent = (gainLoss / totalCost) * 100;

              return {
                id: `crypto-${crypto.id}`,
                symbol: crypto.coin_id,
                name: crypto.coin_name,
                quantity: crypto.quantity,
                currentPrice,
                averageCost: crypto.average_cost,
                totalValue,
                totalCost,
                gainLoss,
                gainLossPercent,
              };
            } catch {
              const currentPrice = crypto.average_cost;
              const totalValue = crypto.quantity * currentPrice;
              const totalCost = crypto.quantity * crypto.average_cost;
              return {
                id: `crypto-${crypto.id}`,
                symbol: crypto.coin_id,
                name: crypto.coin_name,
                quantity: crypto.quantity,
                currentPrice,
                averageCost: crypto.average_cost,
                totalValue,
                totalCost,
                gainLoss: 0,
                gainLossPercent: 0,
              };
            }
          })
        );

        allHoldings.push(
          ...stocksWithPrices,
          ...mfWithPrices,
          ...cryptoWithPrices
        );

        setHoldings(allHoldings);
      } catch (err) {
        setIsError(true);
        setError(
          err instanceof Error ? err : new Error("Failed to fetch holdings")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchHoldings();
  }, []);

  return { holdings, isLoading, isError, error };
};

export default usePortfolioHoldings;
