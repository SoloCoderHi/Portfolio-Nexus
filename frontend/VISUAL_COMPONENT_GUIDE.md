# Visual Component Guide - Add Transaction UI

This guide shows what the UI components should look like when implemented.

---

## 🔘 Floating Action Button (FAB)

### Position & Appearance
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                    Main Content Area                    │
│                                                         │
│                                                         │
│                                                         │
│                                                         │
│                                                         │
│                                                         │
│                                                         │
│                                               ┌────┐    │
│                                               │ +  │    │ ← FAB
│                                               └────┘    │
└─────────────────────────────────────────────────────────┘
```

### CSS Classes Applied
- `fixed bottom-6 right-6` - Always in bottom-right
- `w-14 h-14` - 56px x 56px circle
- `bg-blue-600` - Blue background (#2563eb)
- `rounded-full` - Perfect circle
- `shadow-lg` - Elevation shadow
- `hover:bg-blue-700` - Darker on hover

### States
| State | Color | Behavior |
|-------|-------|----------|
| Default | Blue (#2563eb) | Visible, clickable |
| Hover | Darker Blue (#1d4ed8) | Cursor changes to pointer |
| Focus | Blue + ring | Shows focus ring |
| Clicked | Opens modal | - |

---

## 📱 Add Transaction Modal

### Modal Structure
```
Full Screen Overlay (70% opacity black)
┌───────────────────────────────────────────────────────────┐
│                                                           │
│     Centered Modal Container (max-width: 28rem)          │
│     ┌───────────────────────────────────────────┐        │
│     │  Add Transaction                      ✕   │ ← Header
│     ├───────────────────────────────────────────┤        │
│     │                                           │        │
│     │  Description:                             │        │
│     │  [________________________]               │        │
│     │                                           │        │
│     │  Amount:                                  │        │
│     │  [________________________]               │        │
│     │                                           │        │
│     │  Date:                                    │        │
│     │  [________________________]               │        │
│     │                                           │        │
│     │  Category:                                │        │
│     │  [▼ Select a category____]                │        │
│     │                                           │        │
│     │  [Cancel]          [Save]                 │ ← Buttons
│     └───────────────────────────────────────────┘         │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

### Color Scheme (Dark Theme)
- **Overlay:** `bg-black/70` - Semi-transparent black
- **Modal Container:** `bg-slate-900` - Dark slate (#0f172a)
- **Border:** `border-slate-700` - Medium slate (#334155)
- **Input Fields:** `bg-slate-800` - Darker slate (#1e293b)
- **Labels:** `text-slate-300` - Light slate (#cbd5e1)
- **Title:** `text-slate-100` - Almost white (#f1f5f9)

---

## 📝 Form Fields Detail

### 1. Description Field
```
Label: "Description"
┌─────────────────────────────────────────────┐
│ e.g., Starbucks Coffee                      │ ← Placeholder
└─────────────────────────────────────────────┘
```
- Type: `text`
- Required: Yes
- Placeholder: "e.g., Starbucks Coffee"

### 2. Amount Field
```
Label: "Amount"
┌─────────────────────────────────────────────┐
│ 0.00                                        │ ← Placeholder
└─────────────────────────────────────────────┘
```
- Type: `number`
- Step: `0.01`
- Min: `0`
- Required: Yes
- Placeholder: "0.00"

### 3. Date Field
```
Label: "Date"
┌─────────────────────────────────────────────┐
│ 2025-11-10                                  │ ← Today's date
└─────────────────────────────────────────────┘
```
- Type: `date`
- Default: Today's date
- Required: Yes
- Format: YYYY-MM-DD

### 4. Category Dropdown
```
Label: "Category"
┌─────────────────────────────────────────────┐
│ Select a category                        ▼  │ ← Before load
└─────────────────────────────────────────────┘

After categories load:
┌─────────────────────────────────────────────┐
│ Food                                     ▼  │ ← With options
│ ├─ Food                                     │
│ ├─ Transport                                │
│ └─ Entertainment                            │
└─────────────────────────────────────────────┘
```
- Type: `select`
- Required: Yes
- Loading state: "Loading categories..."
- Empty state: "Select a category"

---

## 🎨 Interactive States

### Focus State (Any Input Field)
```
Normal:
┌─────────────────────────────────────────────┐
│                                             │
└─────────────────────────────────────────────┘

Focused:
┌─────────────────────────────────────────────┐
│ █ (cursor blinking)                         │
└─────────────────────────────────────────────┘
  ↑ Blue ring appears around field
```

### Button States

#### Cancel Button
```
Default:    [  Cancel  ]  ← Gray bg, slate text
Hover:      [  Cancel  ]  ← Lighter gray
Disabled:   [  Cancel  ]  ← Grayed out, no cursor
```

#### Save Button
```
Default:    [   Save   ]  ← Blue bg, white text
Hover:      [   Save   ]  ← Darker blue
Saving:     [ Saving... ]  ← Disabled, shows text
Disabled:   [   Save   ]  ← Grayed out, 50% opacity
```

---

## 🔄 User Flow Visualization

### Complete Flow
```
1. User sees FAB
   ┌────┐
   │ +  │  ← Always visible
   └────┘

2. User clicks FAB
   ↓
   Modal opens with overlay

3. Categories load automatically
   React Query fetches: GET /expense/v1/categories
   
4. User fills form
   Description: "Starbucks Coffee"
   Amount: 5.75
   Date: 2025-11-10
   Category: Food

5. User clicks "Save"
   Button shows: "Saving..."
   React Query mutation: POST /expense/v1/expenses

6. Success!
   Modal closes
   React Query invalidates: ["expenses"]
   React Query refetches expense list
   
7. User can click FAB again
   Form is reset and ready for next entry
```

---

## 📊 React Query Devtools View

### When Modal Opens
```
React Query Devtools:
┌──────────────────────────────────────────┐
│ Queries                                  │
├──────────────────────────────────────────┤
│ ✓ ["categories"]         fresh   1.2s   │ ← New query appears
│   • Data: Array(3)                       │
│   • Status: success                      │
└──────────────────────────────────────────┘
```

### When Saving
```
React Query Devtools:
┌──────────────────────────────────────────┐
│ Mutations                                │
├──────────────────────────────────────────┤
│ ⏳ mutation                    pending   │ ← Mutation in progress
│   • Variables: {description: "...", ...} │
└──────────────────────────────────────────┘
```

### After Success
```
React Query Devtools:
┌──────────────────────────────────────────┐
│ Queries                                  │
├──────────────────────────────────────────┤
│ ⟳ ["expenses"]          fetching        │ ← Auto-refetch!
│ ✓ ["categories"]         fresh   1m     │
└──────────────────────────────────────────┘
```

---

## 🌐 Network Tab View

### GET Categories Request
```
Request:
GET http://localhost:9812/expense/v1/categories
Headers:
  X-User-Id: abc123...
  Content-Type: application/json

Response: 200 OK
[
  {
    "id": 1,
    "userId": "abc123...",
    "name": "Food",
    "parentId": null
  },
  ...
]
```

### POST Expense Request
```
Request:
POST http://localhost:9812/expense/v1/expenses
Headers:
  X-User-Id: abc123...
  Content-Type: application/json
Body:
{
  "description": "Starbucks Coffee",
  "amount": 5.75,
  "expenseDate": "2025-11-10",
  "categoryId": 1
}

Response: 201 Created
{
  "id": 42,
  "externalId": "uuid-here",
  "userId": "abc123...",
  "description": "Starbucks Coffee",
  "amount": 5.75,
  "expenseDate": "2025-11-10",
  "category": {
    "id": 1,
    "name": "Food",
    ...
  },
  "createdAt": "2025-11-10T12:00:00Z",
  "updatedAt": "2025-11-10T12:00:00Z"
}
```

---

## ✅ Visual Checklist

When testing, you should see:

- [ ] Blue circular FAB in bottom-right corner
- [ ] FAB appears on ALL pages (Dashboard, Portfolio, etc.)
- [ ] FAB has plus (+) icon in center
- [ ] FAB turns darker blue on hover
- [ ] Click FAB → Modal appears
- [ ] Dark overlay behind modal
- [ ] Modal is centered on screen
- [ ] Modal has "Add Transaction" title
- [ ] Close button (X) in top-right of modal
- [ ] 4 form fields with labels
- [ ] Description field is text input
- [ ] Amount field is number input
- [ ] Date field is date picker with today's date
- [ ] Category dropdown shows categories from API
- [ ] Cancel button on left
- [ ] Save button on right (blue)
- [ ] Click Cancel → Modal closes
- [ ] Click overlay → Modal closes
- [ ] Click inside modal → Modal stays open
- [ ] Fill form and click Save → Button shows "Saving..."
- [ ] After save → Modal closes
- [ ] Open modal again → Form is reset

---

## 🎭 Accessibility Features

✓ **Keyboard Navigation**
- Tab through all form fields
- Enter to submit form
- Escape to close modal (can be added)

✓ **ARIA Labels**
- FAB has `aria-label="Add transaction"`
- Close button has `aria-label="Close modal"`

✓ **Focus Management**
- Blue focus ring on all interactive elements
- Clear visual feedback for current focus

✓ **Screen Readers**
- Labels properly associated with inputs
- Required fields marked

---

This visual guide should help you verify that the implementation looks and behaves correctly!
