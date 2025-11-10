# Phase 3 Testing Guide - Recent Transactions Dashboard Integration

This is the **final phase** of Iteration 2! You're replacing the mock Watchlist with a real, unified transaction feed.

---

## 🎯 What Changed

### Files Created (2):
1. **`src/hooks/useRecentTransactions.ts`** - Unified transaction hook
2. **`src/components/widgets/RecentTransactions.tsx`** - New widget component

### Files Modified (1):
1. **`src/pages/Dashboard.tsx`** - Replaced WatchlistTable with RecentTransactions

---

## ✅ Final Project Checkpoint

### Step 1: Start All Services

```bash
# Stop any running services
docker-compose down

# Rebuild and start everything
docker-compose up --build
```

Wait for all services to be healthy (especially expenseservice).

### Step 2: Start Frontend

```bash
cd frontend
npm run dev
```

---

## 🔍 Verification Steps

### Test 1: Dashboard Shows Recent Transactions

1. Open `http://localhost:5173`
2. Log in to the application
3. Navigate to the Dashboard

**Expected Results:**

✅ **Old "Watchlist" widget is GONE**
✅ **New "Recent Transactions" widget appears in the same spot**
✅ **Widget shows:**
   - Header: "Recent Transactions"
   - Subtitle: "Your latest expenses and asset purchases"

---

### Test 2: Verify Data Display

**With No Data:**
- If you have no expenses or assets, you should see:
  - 💰 Icon in center
  - "No transactions yet"
  - "Start by adding an expense or asset purchase"

**With Data:**
- If you have portfolio holdings (stocks/crypto/mutual funds), you should see:
  - 📈 Blue icon for asset purchases
  - Description: "Bought X SYMBOL"
  - Negative amount in red (e.g., "-$150.00")
  - Purchase date

- If you added expenses in Phase 2, you should see:
  - 💳 Red icon for expenses
  - Description: Your expense description (e.g., "Starbucks Coffee")
  - Negative amount in red (e.g., "-$5.75")
  - Expense date

**Sort Order:**
- Most recent transactions appear at the top
- Transactions are sorted by date (newest first)

---

### Test 3: End-to-End React Query Flow

This is the **big test** - verify automatic updates!

#### Part A: Add a New Expense

1. Click the **blue FAB** (+ button) in bottom-right
2. Fill out the form:
   - Description: "Lyft Ride"
   - Amount: 25.00
   - Date: Today's date
   - Category: Select any category (e.g., "Food")
3. Click **"Save"**

**Expected Results:**

✅ Modal closes automatically
✅ No page refresh needed

#### Part B: Verify Automatic Update

Look at the "Recent Transactions" widget on your Dashboard:

✅ **"Lyft Ride" appears at the TOP of the list** (newest first)
✅ Shows red expense icon (💳)
✅ Shows "-$25.00" in red
✅ Shows today's date

**This happens automatically because:**
1. `useAddExpense` mutation succeeds
2. React Query invalidates `["expenses"]` query
3. `useExpenses` automatically refetches
4. `useRecentTransactions` recalculates with new data
5. Component re-renders with updated list

**No manual refresh needed! 🎉**

---

### Test 4: Multiple Transaction Types

Add a variety of data to see the mixed feed:

1. Add another expense: "Coffee", $5.00
2. Check the widget - should show both expenses
3. If you have portfolio holdings (stocks, crypto, etc.), they should appear mixed in

**Expected Transaction List Example:**
```
💳 Lyft Ride              -$25.00   Nov 10, 2025
💳 Coffee                 -$5.00    Nov 10, 2025
📈 Bought 10 AAPL         -$1500.00 Nov 5, 2025
📈 Bought 0.5 bitcoin     -$30000.00 Nov 1, 2025
💳 Starbucks Coffee       -$5.75    Oct 28, 2025
```

---

### Test 5: Loading States

1. Refresh the page (F5)
2. Watch the "Recent Transactions" widget

**Expected Loading State:**
- Shows 5 skeleton loading rows
- Animated pulse effect
- After data loads, shows real transactions

---

### Test 6: React Query Devtools Verification

1. Open React Query Devtools (TanStack logo, bottom-right)
2. Look for these queries:

**Before Adding Expense:**
```
Queries:
  ✓ ["categories"]  - fresh
  ✓ ["expenses"]    - fresh
```

**After Adding Expense:**
```
Mutations:
  ⏳ mutation - pending (while saving)

Then:
Queries:
  ✓ ["categories"]  - fresh
  ⟳ ["expenses"]    - fetching (auto-refetch!)
  ✓ ["expenses"]    - fresh (updated!)
```

The expenses query automatically refetches after the mutation!

---

### Test 7: Network Tab Verification

Open Browser DevTools → Network Tab

**When Dashboard Loads:**
- ✅ GET `http://localhost:9812/expense/v1/expenses`
- ✅ GET `http://localhost:9811/portfolio/v1/stocks`
- ✅ GET `http://localhost:9811/portfolio/v1/mutual-funds`
- ✅ GET `http://localhost:9811/portfolio/v1/cryptos`
- ✅ All requests succeed (200 OK)

**When Adding Expense:**
- ✅ POST `http://localhost:9812/expense/v1/expenses`
- ✅ Response: 201 Created
- ✅ Followed by automatic GET to refetch expenses

---

## 🎨 Visual Checklist

When testing, verify:

- [ ] Dashboard loads without errors
- [ ] "Recent Transactions" widget appears (Watchlist is gone)
- [ ] Widget has proper dark theme styling (matches rest of dashboard)
- [ ] Icons are visible (blue for assets, red for expenses)
- [ ] Amounts show in red with minus sign
- [ ] Dates are formatted nicely (e.g., "Nov 10, 2025")
- [ ] Descriptions are clear and truncated if too long
- [ ] Loading state shows skeleton loaders
- [ ] Empty state shows helpful message and icon
- [ ] Hover effects work (transactions highlight on hover)
- [ ] Limited to 10 most recent (shows "Showing 10 of X" if more)

---

## 🐛 Troubleshooting

### Issue: Widget shows "No transactions yet" but I have data

**Check:**
1. Open React Query Devtools
2. Look at `["expenses"]` query - does it have data?
3. Check browser console for errors
4. Verify expense service is running: `docker ps | findstr expense`
5. Check Network tab - are API calls succeeding?

### Issue: Transactions not updating after adding expense

**Check:**
1. Did the modal close? (If not, there was an error)
2. Check React Query Devtools - did mutation succeed?
3. Check browser console for errors
4. Verify `onSuccess` in `useAddExpense` calls `invalidateQueries`

### Issue: Portfolio holdings not showing

**Check:**
1. Do you have any holdings in your database?
2. Check portfolio service is running: `docker ps | findstr portfolio`
3. Check Network tab for `/portfolio/v1/*` requests
4. Look for errors in browser console

### Issue: Dates showing incorrectly

**Expected format:** "Nov 10, 2025"
**If different:** Check browser locale settings

### Issue: Amounts showing as positive instead of negative

**Check:**
- Expenses should be `-expense.amount` (negative)
- Assets should be `-holding.totalCost` (negative)
- Both should show in red with minus sign

---

## 📊 Data Flow Summary

```
User adds expense via FAB
         ↓
useAddExpense mutation fires
         ↓
POST /expense/v1/expenses
         ↓
Backend saves expense
         ↓
Response: 201 Created
         ↓
onSuccess: invalidateQueries(["expenses"])
         ↓
useExpenses automatically refetches
         ↓
GET /expense/v1/expenses (background)
         ↓
useRecentTransactions recalculates
         ↓
RecentTransactions component re-renders
         ↓
User sees new expense at top of list!
```

**All automatic - no page refresh! 🚀**

---

## 🎉 Success Criteria

Phase 3 is complete when:

✅ Watchlist widget is removed from Dashboard
✅ RecentTransactions widget appears in its place
✅ Widget shows combined list of expenses and assets
✅ Transactions sorted by date (newest first)
✅ Loading states work
✅ Empty state shows helpful message
✅ Adding new expense updates the list automatically
✅ Icons and colors correct (red for expense, blue for asset)
✅ Dates formatted nicely
✅ Amounts show negative with dollar sign
✅ React Query invalidation working
✅ No console errors

---

## 🏆 ITERATION 2 COMPLETE!

If all tests pass, you've successfully:

1. ✅ Built a complete expense tracking microservice (backend)
2. ✅ Integrated React Query for state management (frontend)
3. ✅ Created a FAB and modal for adding expenses (UI)
4. ✅ Built a unified transaction feed (integration)
5. ✅ Replaced mock data with real, live data (dashboard)

**Your app now shows real-time, auto-updating financial data!** 🎊

---

## 📖 Next Steps (Future Iterations)

Now that the foundation is solid, you could:

- Add expense filtering/search
- Create expense charts and analytics
- Add category management UI
- Build expense reports
- Add budget tracking
- Create recurring expenses
- Add expense editing
- Implement expense categories tree view
- Add export to CSV/PDF

The possibilities are endless! 🚀
