import { useQuery } from "@tanstack/react-query";
import { getExpenses } from "../api/expenseService";

export const useExpenses = () => {
  return useQuery({
    queryKey: ["expenses"],
    queryFn: getExpenses,
  });
};
