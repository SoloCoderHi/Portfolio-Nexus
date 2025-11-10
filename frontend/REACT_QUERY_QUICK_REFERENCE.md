# React Query Integration - Quick Reference

## 🎯 How to Use These Hooks in Components

### Fetching Data (Read Operations)

#### Get All Categories
```tsx
import { useCategories } from '../hooks/useCategories';

function MyComponent() {
  const { data, isLoading, isError, error } = useCategories();

  if (isLoading) return <div>Loading categories...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data?.map(category => (
        <li key={category.id}>{category.name}</li>
      ))}
    </ul>
  );
}
```

#### Get All Expenses
```tsx
import { useExpenses } from '../hooks/useExpenses';

function ExpenseList() {
  const { data: expenses, isLoading } = useExpenses();

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        expenses?.map(expense => (
          <div key={expense.externalId}>
            <h3>{expense.description}</h3>
            <p>${expense.amount}</p>
            <p>Date: {expense.expenseDate}</p>
            <p>Category: {expense.category.name}</p>
          </div>
        ))
      )}
    </div>
  );
}
```

---

### Mutating Data (Write Operations)

#### Create a New Category
```tsx
import { useAddCategory } from '../hooks/useAddCategory';
import { CategoryRequestDto } from '../api/expenseService';

function CreateCategoryForm() {
  const { mutate, isPending, isError, error } = useAddCategory();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const dto: CategoryRequestDto = {
      name: formData.get('name') as string,
      parentId: formData.get('parentId') ? Number(formData.get('parentId')) : null,
    };

    mutate(dto, {
      onSuccess: () => {
        alert('Category created!');
        // The useCategories hook will automatically refetch!
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Category name" required />
      <input name="parentId" placeholder="Parent ID (optional)" type="number" />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Category'}
      </button>
      {isError && <p>Error: {error.message}</p>}
    </form>
  );
}
```

#### Create a New Expense
```tsx
import { useAddExpense } from '../hooks/useAddExpense';
import { ExpenseRequestDto } from '../api/expenseService';

function CreateExpenseForm() {
  const { mutate, isPending } = useAddExpense();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const dto: ExpenseRequestDto = {
      amount: Number(formData.get('amount')),
      description: formData.get('description') as string,
      expenseDate: formData.get('date') as string, // YYYY-MM-DD format
      categoryId: Number(formData.get('categoryId')),
    };

    mutate(dto, {
      onSuccess: () => {
        alert('Expense added!');
        // The useExpenses hook will automatically refetch!
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="description" placeholder="Description" required />
      <input name="amount" type="number" step="0.01" placeholder="Amount" required />
      <input name="date" type="date" required />
      <input name="categoryId" type="number" placeholder="Category ID" required />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Adding...' : 'Add Expense'}
      </button>
    </form>
  );
}
```

#### Delete an Expense
```tsx
import { useDeleteExpense } from '../hooks/useDeleteExpense';

function ExpenseItem({ expense }) {
  const { mutate: deleteExpense, isPending } = useDeleteExpense();

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this expense?')) {
      deleteExpense(expense.externalId, {
        onSuccess: () => {
          alert('Expense deleted!');
          // The useExpenses hook will automatically refetch!
        },
      });
    }
  };

  return (
    <div>
      <h3>{expense.description}</h3>
      <p>${expense.amount}</p>
      <button onClick={handleDelete} disabled={isPending}>
        {isPending ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  );
}
```

---

## 🔄 Automatic Features (Built-in!)

### 1. Automatic Cache Management
React Query automatically caches data. If you navigate away and come back, it shows cached data instantly, then refetches in the background.

### 2. Query Invalidation
When you create or delete an expense, the mutation hooks automatically invalidate the queries:
```tsx
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ["expenses"] });
}
```
This triggers a refetch of `useExpenses()` anywhere it's used!

### 3. Loading & Error States
Every hook returns:
- `isLoading` - First time loading
- `isFetching` - Refetching (background)
- `isError` - Something went wrong
- `error` - The error object
- `isPending` - Mutation in progress (for mutations)

---

## 🎨 Common Patterns

### Pattern 1: Combo Component (List + Create)
```tsx
function ExpenseManager() {
  const { data: expenses, isLoading } = useExpenses();
  const { mutate: addExpense } = useAddExpense();

  return (
    <div>
      <CreateExpenseForm onSubmit={(dto) => addExpense(dto)} />
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ExpenseList expenses={expenses} />
      )}
    </div>
  );
}
```

### Pattern 2: Select Category Dropdown
```tsx
function CategorySelect() {
  const { data: categories } = useCategories();

  return (
    <select name="categoryId">
      {categories?.map(cat => (
        <option key={cat.id} value={cat.id}>
          {cat.name}
        </option>
      ))}
    </select>
  );
}
```

### Pattern 3: Optimistic Updates (Advanced)
```tsx
const { mutate } = useDeleteExpense();

mutate(expenseId, {
  onMutate: async (deletedId) => {
    // Cancel refetch
    await queryClient.cancelQueries({ queryKey: ['expenses'] });
    
    // Snapshot previous value
    const previousExpenses = queryClient.getQueryData(['expenses']);
    
    // Optimistically update UI
    queryClient.setQueryData(['expenses'], (old) =>
      old?.filter(e => e.externalId !== deletedId)
    );
    
    return { previousExpenses };
  },
  onError: (err, deletedId, context) => {
    // Rollback on error
    queryClient.setQueryData(['expenses'], context.previousExpenses);
  },
  onSettled: () => {
    // Always refetch
    queryClient.invalidateQueries({ queryKey: ['expenses'] });
  },
});
```

---

## 🐛 React Query Devtools

### How to Use
1. Look for the TanStack logo in the bottom-right corner
2. Click to open the devtools panel
3. View all active queries and their state
4. See cache data, refetch timing, and more

### Useful Features
- **Query Inspector**: Click any query to see its data, status, and timing
- **Manual Refetch**: Force a query to refetch
- **Cache Explorer**: See all cached data
- **Mutations Tab**: Track in-progress mutations

---

## 📊 TypeScript Types Reference

```tsx
// From expenseService.ts
interface ExpenseCategory {
  id: number;
  userId: string;
  name: string;
  parentId: number | null;
}

interface Expense {
  id: number;
  externalId: string;
  userId: string;
  amount: number;
  description: string;
  expenseDate: string; // ISO date string (YYYY-MM-DD)
  category: ExpenseCategory;
  createdAt: string;
  updatedAt: string;
}

interface CategoryRequestDto {
  name: string;
  parentId?: number | null;
}

interface ExpenseRequestDto {
  amount: number;
  description: string;
  expenseDate: string; // YYYY-MM-DD
  categoryId: number;
}
```

---

## 🚨 Important Notes

1. **Date Format**: Always use `YYYY-MM-DD` for `expenseDate` (e.g., "2025-11-10")
2. **User Authentication**: All requests automatically include `X-User-Id` header (set via `setUserId()`)
3. **Error Handling**: Always handle `isError` state in UI
4. **Loading States**: Show loading indicators using `isLoading` or `isPending`

---

## 📖 Next Steps

Ready to build UI? Check out:
- **Dashboard**: Add expense summary widgets
- **Expense Page**: Full CRUD interface
- **Category Manager**: Hierarchical category tree
- **Charts**: Expense trends using Recharts
