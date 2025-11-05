import { useState, useEffect } from "react";
import { getAllHoldings } from "../api/portfolioService";
import {
  getStockPrice,
  getMutualFundPrice,
  getCryptoPrice,
} from "../api/marketDataService";

export type PortfolioValue = {
  totalValue: number;
  returnAmount: number;
  returnPercent: number;
  totalInvested: number;
};

export type UseTotalPortfolioValueReturn = {
  data: PortfolioValue | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
};

export const useTotalPortfolioValue = (): UseTotalPortfolioValueReturn => {
  const [data, setData] = useState<PortfolioValue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPortfolioValue = async () => {
      try {
        setIsLoading(true);
        setIsError(false);

        const { stocks, mutualFunds, cryptos } = await getAllHoldings();

        let totalValue = 0;
        let totalInvested = 0;

        const stockPrices = await Promise.all(
          stocks.map(async (stock) => {
            try {
              const price = await getStockPrice(stock.symbol);
              return {
                currentValue: stock.quantity * price.current_price,
                invested: stock.quantity * stock.average_cost,
              };
            } catch {
              return {
                currentValue: stock.quantity * stock.average_cost,
                invested: stock.quantity * stock.average_cost,
              };
            }
          })
        );

        const mfPrices = await Promise.all(
          mutualFunds.map(async (mf) => {
            try {
              const price = await getMutualFundPrice(mf.scheme_code);
              return {
                currentValue: mf.quantity * price.nav,
                invested: mf.quantity * mf.average_nav,
              };
            } catch {
              return {
                currentValue: mf.quantity * mf.average_nav,
                invested: mf.quantity * mf.average_nav,
              };
            }
          })
        );

        const cryptoPrices = await Promise.all(
          cryptos.map(async (crypto) => {
            try {
              const price = await getCryptoPrice(crypto.coin_id);
              return {
                currentValue: crypto.quantity * price.current_price,
                invested: crypto.quantity * crypto.average_cost,
              };
            } catch {
              return {
                currentValue: crypto.quantity * crypto.average_cost,
                invested: crypto.quantity * crypto.average_cost,
              };
            }
          })
        );

        [...stockPrices, ...mfPrices, ...cryptoPrices].forEach((item) => {
          totalValue += item.currentValue;
          totalInvested += item.invested;
        });

        const returnAmount = totalValue - totalInvested;
        const returnPercent =
          totalInvested > 0 ? (returnAmount / totalInvested) * 100 : 0;

        setData({
          totalValue,
          returnAmount,
          returnPercent,
          totalInvested,
        });
      } catch (err) {
        setIsError(true);
        setError(
          err instanceof Error ? err : new Error("Failed to fetch portfolio data")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolioValue();
  }, []);

  return { data, isLoading, isError, error };
};

export default useTotalPortfolioValue;
