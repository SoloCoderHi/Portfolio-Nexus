import { expenseClient } from "./client";

export interface ExpenseCategory {
  id: number;
  userId: string;
  name: string;
  parentId: number | null;
}

export interface Expense {
  id: number;
  externalId: string;
  userId: string;
  amount: number;
  description: string;
  expenseDate: string;
  category: ExpenseCategory;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryRequestDto {
  name: string;
  parentId?: number | null;
}

export interface ExpenseRequestDto {
  amount: number;
  description: string;
  expenseDate: string;
  categoryId: number;
}

export const getCategories = async (): Promise<ExpenseCategory[]> => {
  const response = await expenseClient.get<ExpenseCategory[]>(
    "/expense/v1/categories"
  );
  return response.data;
};

export const createCategory = async (
  dto: CategoryRequestDto
): Promise<ExpenseCategory> => {
  const response = await expenseClient.post<ExpenseCategory>(
    "/expense/v1/categories",
    dto
  );
  return response.data;
};

export const getExpenses = async (): Promise<Expense[]> => {
  const response = await expenseClient.get<Expense[]>("/expense/v1/expenses");
  return response.data;
};

export const createExpense = async (
  dto: ExpenseRequestDto
): Promise<Expense> => {
  const response = await expenseClient.post<Expense>(
    "/expense/v1/expenses",
    dto
  );
  return response.data;
};

export const deleteExpense = async (externalId: string): Promise<void> => {
  await expenseClient.delete(`/expense/v1/expenses/${externalId}`);
};
