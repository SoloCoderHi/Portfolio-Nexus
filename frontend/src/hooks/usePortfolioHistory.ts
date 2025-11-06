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

// --- THIS IS OUR NEW SIMULATED DATA LOGIC ---
const generateSimulatedData = (): PortfolioHistoryPoint[] => {
  const data: PortfolioHistoryPoint[] = [];
  const totalDays = 30; // Simulate 30 days of history
  const investmentDay = 10; // Day the user "invested"
  const initialInvestment = 867000; // Total of all our dummy data invested value

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - totalDays);

  for (let i = 0; i <= totalDays; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

    let value = 0;
    if (i >= investmentDay) {
      // After investment day, simulate market fluctuation
      const daysSinceInvestment = i - investmentDay;
      const volatility = (Math.random() - 0.45) * (initialInvestment * 0.01); // ~1% daily swing
      const trend = daysSinceInvestment * 1500; // Steady growth
      value = initialInvestment + trend + volatility;
    }

    const shortDate = currentDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const fullDate = currentDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    data.push({
      date: shortDate,
      value: Math.round(value),
      timestamp: fullDate,
    });
  }
  return data;
};
// --- END OF NEW LOGIC ---

export const usePortfolioHistory = (): UsePortfolioHistoryReturn => {
  const [isLoading] = useState(false);
  const [isError] = useState(false);

  // Return successful data
  return {
    data: generateSimulatedData(),
    isLoading: false,
    isError: false,
    error: null,
  };
};

export default usePortfolioHistory;
