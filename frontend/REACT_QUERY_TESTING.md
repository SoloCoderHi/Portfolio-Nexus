# Frontend Integration - Phase 1 Testing Guide

This guide helps you verify that React Query and the expense service integration are working correctly.

## Prerequisites

1. **Start Backend Services:**
   ```bash
   cd C:\Users\hello\Documents\Coding\Projects\Portfolio-Nexus
   docker-compose up --build
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

## Phase 1 Checkpoint Verification

### ✅ Step 1: Verify Application Loads

1. Open your browser to `http://localhost:5173`
2. The application should load without any crashes
3. You should be able to log in successfully

**Expected Result:** No console errors related to React Query or QueryClientProvider

---

### ✅ Step 2: Verify React Query Devtools

1. After logging in, look for the **React Query Devtools** icon in the bottom-right corner of the screen
2. It should appear as a small TanStack logo or flower-like icon
3. Click the icon to open the devtools panel

**Expected Result:** 
- Devtools panel opens showing "Queries" and "Mutations" tabs
- Initially, you should see existing queries from other services (if any)
- No `/expense/v1` queries should be visible yet (we haven't used the hooks in any components)

---

### ✅ Step 3: Check Network Tab

1. Open browser Developer Tools (F12)
2. Navigate to the **Network** tab
3. Navigate to the Dashboard page
4. Filter network requests by "expense" or check all XHR requests

**Expected Result:**
- **NO** network calls to `http://localhost:9812/expense/v1/...` should be visible
- This is correct! We haven't added any components using the expense hooks yet

---

### ✅ Step 4: Verify Configuration Files

Check that all files were created correctly:

#### `src/main.tsx`
```tsx
// Should contain:
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

// In the render:
<QueryClientProvider client={queryClient}>
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

#### `src/api/client.ts`
```tsx
// Should contain:
export const API_BASE_URLS = {
  auth: "http://localhost:9898",
  portfolio: "http://localhost:9811",
  marketData: "http://localhost:8010",
  user: "http://localhost:9810",
  expense: "http://localhost:9812",  // ← New!
};

export const expenseClient = axios.create({
  baseURL: API_BASE_URLS.expense,
  headers: {
    "Content-Type": "application/json",
  },
});

// Both setAuthToken and setUserId should include expenseClient
```

#### Verify New Files Exist
```bash
src/api/expenseService.ts
src/hooks/useCategories.ts
src/hooks/useExpenses.ts
src/hooks/useAddExpense.ts
src/hooks/useDeleteExpense.ts
src/hooks/useAddCategory.ts
```

---

## Manual Testing of Hooks (Optional Advanced Check)

If you want to test that the hooks work before building UI components:

### Test in Browser Console

1. Log in to the application
2. Open browser console
3. You can manually test the API client:

```javascript
// Get the expenseClient from window (if exposed) or test directly
// This assumes you're logged in and have a valid X-User-Id header set

// Test getting categories (should return empty array initially)
fetch('http://localhost:9812/expense/v1/categories', {
  headers: {
    'X-User-Id': 'your-user-id-here'  // Use your actual user ID
  }
})
.then(r => r.json())
.then(console.log)
```

**Expected Result:** `[]` (empty array, since no categories exist yet)

---

## Common Issues & Solutions

### Issue: "QueryClient not found" error
**Solution:** Ensure `QueryClientProvider` wraps the entire app in `main.tsx`

### Issue: Devtools not appearing
**Solution:** 
- Check that `@tanstack/react-query-devtools` is installed
- Verify the import in `main.tsx`
- Try refreshing the page

### Issue: Network calls to expense service fail
**Solution:**
- Verify `expenseService` Docker container is running: `docker ps | findstr expense`
- Check health endpoint: `http://localhost:9812/health`
- Verify auth headers are being set (check Network tab → Headers)

### Issue: CORS errors when calling expense API
**Solution:**
- Verify `AppConfig.java` in expenseService has CORS configured
- Check that `localhost:5173` is in allowed origins
- Restart the expenseService container

---

## Next Steps

After verifying Phase 1 is working:

1. **Phase 2** will involve creating UI components that use these hooks
2. You'll create an "Expenses" page/section
3. Components will use `useExpenses()`, `useCategories()`, etc.
4. At that point, you'll see React Query automatically:
   - Cache expense data
   - Manage loading states
   - Handle refetching after mutations
   - Show data in the React Query Devtools

---

## Success Criteria Checklist

- [ ] Frontend runs without crashes (`npm run dev`)
- [ ] Backend runs without crashes (`docker-compose up`)
- [ ] No React Query-related console errors
- [ ] React Query Devtools icon is visible
- [ ] No expense API calls visible in Network tab (expected)
- [ ] All 6 new files created and importable
- [ ] `expenseClient` configured with auth headers
- [ ] Ready to build expense UI components in Phase 2!

---

## File Summary

### Modified Files
1. `src/main.tsx` - Added QueryClientProvider wrapper
2. `src/api/client.ts` - Added expenseClient configuration

### New Files
1. `src/api/expenseService.ts` - API client functions
2. `src/hooks/useCategories.ts` - Fetch categories hook
3. `src/hooks/useExpenses.ts` - Fetch expenses hook
4. `src/hooks/useAddExpense.ts` - Create expense mutation hook
5. `src/hooks/useDeleteExpense.ts` - Delete expense mutation hook
6. `src/hooks/useAddCategory.ts` - Create category mutation hook

### New Package
- `@tanstack/react-query-devtools` - Development tools for debugging
