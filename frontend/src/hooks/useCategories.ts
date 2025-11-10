import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../api/expenseService";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
};
