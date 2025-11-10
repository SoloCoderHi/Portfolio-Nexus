import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteExpense } from "../api/expenseService";

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (externalId: string) => deleteExpense(externalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
};
