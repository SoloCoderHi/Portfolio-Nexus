# Phase 2 Testing Guide - Add Transaction UI

This guide helps you test the new Floating Action Button (FAB) and Add Transaction modal.

## Prerequisites

1. **Backend Services Running:**
   ```bash
   cd C:\Users\hello\Documents\Coding\Projects\Portfolio-Nexus
   docker-compose up --build
   ```

2. **Create Test Category (if not already done):**
   ```bash
   curl -X POST http://localhost:9812/expense/v1/categories \
     -H "X-User-Id: test-user-123" \
     -H "Content-Type: application/json" \
     -d '{"name": "Food"}'
   ```

3. **Frontend Running:**
   ```bash
   cd frontend
   npm run dev
   ```

---

## ✅ Test 1: FAB Visibility & Click

### Steps:
1. Open browser to `http://localhost:5173`
2. Log in to the application
3. Navigate to any page (Dashboard, Portfolio, etc.)

### Expected Results:
- ✅ Blue circular button visible in bottom-right corner
- ✅ Button has a white "plus" (+) icon
- ✅ Button appears on ALL pages (it's in App.tsx layout)
- ✅ Hover effect: button turns darker blue on hover

### Screenshot Checkpoint:
![FAB Screenshot - should show blue button in bottom right]

---

## ✅ Test 2: Modal Opening

### Steps:
1. Click the FAB button

### Expected Results:
- ✅ Dark overlay appears (70% opacity black background)
- ✅ Modal appears in center of screen
- ✅ Modal has dark slate background with border
- ✅ Modal shows "Add Transaction" title
- ✅ Close button (X) visible in top-right corner of modal

### State Verification:
- Open React DevTools
- Check `App` component
- `isModalOpen` state should be `true`

---

## ✅ Test 3: Modal Closing

### Steps:
1. With modal open, click the X button
2. Re-open modal
3. Click outside the modal (on dark overlay)

### Expected Results:
- ✅ Modal closes when clicking X button
- ✅ Modal closes when clicking overlay
- ✅ Modal stays open when clicking inside the modal content
- ✅ `isModalOpen` state returns to `false`

---

## ✅ Test 4: React Query - Category Loading

### Steps:
1. Open React Query Devtools (TanStack logo in bottom-right)
2. Click the FAB to open modal

### Expected Results in React Query Devtools:
- ✅ New query appears: `["categories"]`
- ✅ Query status: "fresh" (green) or "success"
- ✅ Query has data (array of categories)
- ✅ Click the query to inspect - should show your categories

### Expected Results in Network Tab:
- ✅ XHR request to `http://localhost:9812/expense/v1/categories`
- ✅ Request headers include `X-User-Id`
- ✅ Response status: 200 OK
- ✅ Response body: Array of categories (e.g., `[{"id":1,"userId":"...","name":"Food","parentId":null}]`)

---

## ✅ Test 5: Form Field Validation

### Steps:
1. Open modal
2. Observe the form fields

### Expected Results:
- ✅ **Description field:** Text input, placeholder "e.g., Starbucks Coffee"
- ✅ **Amount field:** Number input, placeholder "0.00", allows decimals
- ✅ **Date field:** Date picker, pre-filled with today's date
- ✅ **Category dropdown:** 
  - Shows "Select a category" as default
  - Shows "Loading categories..." if still loading
  - Populated with your categories (e.g., "Food")
- ✅ All fields have proper labels
- ✅ All fields are required (HTML5 validation)

### Visual Check:
- Dark theme styling matches rest of app
- Fields have slate-800 background
- Fields have blue focus ring when selected

---

## ✅ Test 6: Form Submission - Success Flow

### Steps:
1. Open modal
2. Fill out form:
   - Description: "Starbucks Coffee"
   - Amount: 5.75
   - Date: Today's date (or any date)
   - Category: "Food"
3. Click "Save" button

### Expected Results - UI:
- ✅ Save button shows "Saving..." while request is in progress
- ✅ Save button is disabled during save
- ✅ Modal closes automatically on success
- ✅ Form fields are cleared for next use

### Expected Results - Network Tab:
- ✅ POST request to `http://localhost:9812/expense/v1/expenses`
- ✅ Request headers include `X-User-Id`
- ✅ Request body contains your form data:
  ```json
  {
    "description": "Starbucks Coffee",
    "amount": 5.75,
    "expenseDate": "2025-11-10",
    "categoryId": 1
  }
  ```
- ✅ Response status: 201 Created
- ✅ Response body contains created expense with `externalId`, timestamps, etc.

### Expected Results - React Query Devtools:
- ✅ Mutation fires: `["expenses"]` mutation appears
- ✅ After mutation succeeds:
  - ✅ `["expenses"]` query becomes "stale"
  - ✅ `["expenses"]` query automatically refetches
  - ✅ Query transitions to "fetching" then "fresh"
- ✅ This happens automatically - query invalidation working!

---

## ✅ Test 7: Error Handling

### Test 7a: Missing Fields
1. Open modal
2. Leave one or more fields empty
3. Click "Save"

**Expected:** Browser shows HTML5 validation error (field required)

### Test 7b: Invalid Category
1. Stop the backend (`docker-compose down`)
2. Try to open modal

**Expected:** 
- Category dropdown shows "Select a category"
- Network error in console
- Form still functional, but can't load categories

### Test 7c: Network Error During Save
1. Fill out form completely
2. Stop backend
3. Click "Save"

**Expected:**
- Alert shows: "Failed to add expense: [error message]"
- Modal stays open
- Form data retained

---

## ✅ Test 8: Multiple Expenses

### Steps:
1. Add first expense: "Starbucks Coffee", $5.75
2. Close modal (or it auto-closes)
3. Click FAB again
4. Add second expense: "Lunch", $12.50
5. Repeat a third time

### Expected Results:
- ✅ Each submission works independently
- ✅ Form resets between submissions
- ✅ No duplicate submissions
- ✅ Network tab shows 3 separate POST requests
- ✅ React Query cache updates each time

---

## ✅ Test 9: React Query Cache Behavior

### Steps:
1. Open modal (loads categories)
2. Close modal
3. Wait 5 seconds
4. Open modal again

### Expected Results:
- ✅ Categories appear INSTANTLY (from cache)
- ✅ React Query may refetch in background (check devtools)
- ✅ No loading spinner on second open (cached data shown immediately)

This demonstrates React Query's caching working perfectly!

---

## ✅ Test 10: Cross-Page Persistence

### Steps:
1. Open modal on Dashboard
2. Close it
3. Navigate to Portfolio page
4. Open modal again

### Expected Results:
- ✅ FAB appears on every page
- ✅ Modal works from any page
- ✅ Categories still cached (instant load)
- ✅ State is properly managed globally

---

## 🐛 Common Issues & Solutions

### Issue: FAB not visible
**Solution:** 
- Check z-index (should be high enough to appear above content)
- Verify it's in App.tsx (not in a nested component)
- Check if it's hidden behind other elements

### Issue: Modal doesn't close
**Solution:**
- Verify `onClose` prop is wired correctly
- Check that overlay has `onClick={onClose}`
- Ensure modal content has `onClick={(e) => e.stopPropagation()}`

### Issue: Categories not loading
**Solution:**
- Check expenseService is running: `docker ps | findstr expense`
- Check health endpoint: `http://localhost:9812/health`
- Verify CORS is configured in backend
- Check Network tab for CORS errors
- Verify `X-User-Id` header is set (check AuthProvider)

### Issue: Form submission fails
**Solution:**
- Check all fields are filled
- Verify date format is YYYY-MM-DD
- Check categoryId is a valid number
- Look for error in alert popup
- Check Network tab for 400/500 errors

### Issue: React Query not invalidating
**Solution:**
- Verify mutation `onSuccess` calls `invalidateQueries`
- Check query keys match exactly: `["expenses"]`
- Look in React Query Devtools for query state

---

## 📊 Success Criteria Summary

Phase 2 is complete when:

- [x] FAB visible on all pages
- [x] FAB opens modal on click
- [x] Modal can be closed (X button and overlay)
- [x] Form has all 4 fields (description, amount, date, category)
- [x] Category dropdown loads from API
- [x] Form submits to backend
- [x] Modal closes on successful submission
- [x] React Query automatically refetches expenses
- [x] Network requests visible in DevTools
- [x] React Query Devtools shows queries and mutations
- [x] Error handling works (alerts, validation)
- [x] Form resets after submission

---

## 🎯 What to Look For in React Query Devtools

### When Modal Opens:
```
Queries:
  └─ ["categories"]
      Status: success ✓
      Data: [{id: 1, name: "Food", ...}]
```

### When Saving Expense:
```
Mutations:
  └─ mutation (pending...)
      Variables: {description: "...", amount: 5.75, ...}

After success:

Queries:
  └─ ["expenses"]
      Status: stale → fetching → fresh
      Last Updated: just now
```

This shows the invalidation working!

---

## 🚀 Next Steps

After Phase 2 is verified:
1. **Build expense list view** to display saved expenses
2. **Add delete functionality** using `useDeleteExpense` hook
3. **Create expense dashboard** with charts and summaries
4. **Add category management** UI

The foundation is now complete! 🎉
