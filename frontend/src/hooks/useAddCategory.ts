import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory } from "../api/expenseService";
import type { CategoryRequestDto } from "../api/expenseService";

export const useAddCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CategoryRequestDto) => createCategory(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
