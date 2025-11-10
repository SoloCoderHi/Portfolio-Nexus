import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createExpense } from "../api/expenseService";
import type { ExpenseRequestDto } from "../api/expenseService";

export const useAddExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: ExpenseRequestDto) => createExpense(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
};
