import { marketDataClient } from "./client";

export type StockPrice = {
  symbol: string;
  current_price: number;
  change_24h: number;
  change_percent_24h: number;
  high_24h: number;
  low_24h: number;
  volume_24h: number;
  market_cap?: number;
  timestamp: string;
};

export type MutualFundPrice = {
  scheme_code: string;
  scheme_name: string;
  nav: number;
  date: string;
};

export type CryptoPrice = {
  coin_id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
};

export type AiSearchResponse = {
  response: string;
  timestamp: string;
};

export const getStockPrice = async (symbol: string): Promise<StockPrice> => {
  const response = await marketDataClient.get(`/price/stock/${symbol}`);
  return response.data;
};

export const getMutualFundPrice = async (
  schemeCode: string
): Promise<MutualFundPrice> => {
  const response = await marketDataClient.get(`/price/mf/${schemeCode}`);
  return response.data;
};

export const getCryptoPrice = async (coinId: string): Promise<CryptoPrice> => {
  const response = await marketDataClient.get(`/price/crypto/${coinId}`);
  return response.data;
};

export const searchAi = async (message: string): Promise<AiSearchResponse> => {
  const response = await marketDataClient.post("/v1/ds/message", {
    message,
  });
  return response.data;
};
