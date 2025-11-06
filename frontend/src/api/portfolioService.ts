import { portfolioClient } from "./client";

export type StockHolding = {
  id: number;
  externalId: string;
  userId: string;
  symbol: string;
  exchange: string;
  quantity: number;
  purchasePrice: number;
  purchaseDate: string;
  createdAt: string;
  updatedAt: string;
};

export type MutualFundHolding = {
  id: number;
  externalId: string;
  userId: string;
  schemeCode: string;
  quantity: number;
  purchasePrice: number;
  purchaseDate: string;
  createdAt: string;
  updatedAt: string;
};

export type CryptoHolding = {
  id: number;
  externalId: string;
  userId: string;
  coinId: string;
  symbol: string;
  quantity: number;
  purchasePrice: number;
  purchaseDate: string;
  createdAt: string;
  updatedAt: string;
};

export type ManualHolding = {
  id: number;
  externalId: string;
  userId: string;
  assetName: string;
  assetType: string;
  investedValue: number;
  currentValue: number;
  purchaseDate: string;
  maturityDate: string | null;
  createdAt: string;
  updatedAt: string;
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

export const getManualHoldings = async (): Promise<ManualHolding[]> => {
  const response = await portfolioClient.get("/portfolio/v1/manuals");
  return response.data;
};

export const getAllHoldings = async () => {
  const [stocks, mutualFunds, cryptos, manuals] = await Promise.all([
    getStockHoldings(),
    getMutualFundHoldings(),
    getCryptoHoldings(),
    getManualHoldings(),
  ]);

  return { stocks, mutualFunds, cryptos, manuals };
};


