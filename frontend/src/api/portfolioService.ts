import { portfolioClient } from "./client";

export type StockHolding = {
  id: number;
  user_id: string;
  symbol: string;
  quantity: number;
  average_cost: number;
};

export type MutualFundHolding = {
  id: number;
  user_id: string;
  scheme_code: string;
  scheme_name: string;
  quantity: number;
  average_nav: number;
};

export type CryptoHolding = {
  id: number;
  user_id: string;
  coin_id: string;
  coin_name: string;
  quantity: number;
  average_cost: number;
};

export const getStockHoldings = async (): Promise<StockHolding[]> => {
  const response = await portfolioClient.get("/portfolio/v1/stocks");
  return response.data;
};

export const getMutualFundHoldings = async (): Promise<MutualFundHolding[]> => {
  const response = await portfolioClient.get("/portfolio/v1/mutual-funds");
  return response.data;
};

export const getCryptoHoldings = async (): Promise<CryptoHolding[]> => {
  const response = await portfolioClient.get("/portfolio/v1/cryptos");
  return response.data;
};

export const getAllHoldings = async () => {
  const [stocks, mutualFunds, cryptos] = await Promise.all([
    getStockHoldings(),
    getMutualFundHoldings(),
    getCryptoHoldings(),
  ]);

  return { stocks, mutualFunds, cryptos };
};
