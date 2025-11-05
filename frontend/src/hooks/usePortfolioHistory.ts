import { useState } from "react";

export type PortfolioHistoryPoint = {
  date: string;
  value: number;
  timestamp: string; // Full date for tooltip
};

export type UsePortfolioHistoryReturn = {
  data: PortfolioHistoryPoint[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
};

/**
 * Custom hook to fetch portfolio value history over time
 * TODO: Replace mock data with actual API calls to portfolioService
 */
export const usePortfolioHistory = (): UsePortfolioHistoryReturn => {
  // Mock loading and error states - can be toggled for testing
  const [isLoading] = useState(false);
  const [isError] = useState(false);

  // Generate mock historical data - 50 data points over approximately 50 days
  const generateMockData = (): PortfolioHistoryPoint[] => {
    const data: PortfolioHistoryPoint[] = [];
    const baseValue = 10000;
    const startDate = new Date("2024-01-01");
    
    for (let i = 0; i < 50; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      // Create realistic portfolio growth with some volatility
      const trend = i * 45; // Upward trend
      const volatility = Math.sin(i / 3) * 400 + Math.random() * 300;
      const value = baseValue + trend + volatility;
      
      // Format date for display (abbreviated)
      const shortDate = currentDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      
      // Full date for tooltip
      const fullDate = currentDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      
      data.push({
        date: shortDate,
        value: Math.round(value * 100) / 100,
        timestamp: fullDate,
      });
    }
    
    return data;
  };

  // Simulate error state for testing
  if (isError) {
    return {
      data: [],
      isLoading: false,
      isError: true,
      error: new Error("Failed to fetch portfolio history"),
    };
  }

  // Simulate loading state for testing
  if (isLoading) {
    return {
      data: [],
      isLoading: true,
      isError: false,
      error: null,
    };
  }

  // Return successful data
  return {
    data: generateMockData(),
    isLoading: false,
    isError: false,
    error: null,
  };
};

export default usePortfolioHistory;
