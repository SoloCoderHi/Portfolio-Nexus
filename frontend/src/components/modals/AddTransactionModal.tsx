import { useState, FormEvent } from "react";
import { useCategories } from "../../hooks/useCategories";
import { useAddExpense } from "../../hooks/useAddExpense";
import type { ExpenseRequestDto } from "../../api/expenseService";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddTransactionModal = ({
  isOpen,
  onClose,
}: AddTransactionModalProps) => {
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { mutate: addExpense, isPending } = useAddExpense();

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [categoryId, setCategoryId] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!description || !amount || !expenseDate || !categoryId) {
      alert("Please fill in all fields");
      return;
    }

    const dto: ExpenseRequestDto = {
      description,
      amount: parseFloat(amount),
      expenseDate,
      categoryId: parseInt(categoryId),
    };

    addExpense(dto, {
      onSuccess: () => {
        setDescription("");
        setAmount("");
        setExpenseDate(new Date().toISOString().split("T")[0]);
        setCategoryId("");
        onClose();
      },
      onError: (error) => {
        alert(`Failed to add expense: ${error.message}`);
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-lg border border-slate-700 bg-slate-900 p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 transition-colors hover:text-slate-200"
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Modal Header */}
        <h2 className="mb-6 text-2xl font-bold text-slate-100">
          Add Transaction
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Description Field */}
          <div>
            <label
              htmlFor="description"
              className="mb-1 block text-sm font-medium text-slate-300"
            >
              Description
            </label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="e.g., Starbucks Coffee"
              required
            />
          </div>

          {/* Amount Field */}
          <div>
            <label
              htmlFor="amount"
              className="mb-1 block text-sm font-medium text-slate-300"
            >
              Amount
            </label>
            <input
              type="number"
              id="amount"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="0.00"
              required
            />
          </div>

          {/* Date Field */}
          <div>
            <label
              htmlFor="expenseDate"
              className="mb-1 block text-sm font-medium text-slate-300"
            >
              Date
            </label>
            <input
              type="date"
              id="expenseDate"
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
              className="w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label
              htmlFor="category"
              className="mb-1 block text-sm font-medium text-slate-300"
            >
              Category
            </label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
              disabled={categoriesLoading}
            >
              <option value="">
                {categoriesLoading
                  ? "Loading categories..."
                  : "Select a category"}
              </option>
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md border border-slate-600 bg-slate-800 px-4 py-2 text-slate-300 transition-colors hover:bg-slate-700"
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isPending || categoriesLoading}
            >
              {isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
