# Expense Service API Testing Guide

This guide provides curl commands and Postman/Insomnia examples for testing the Expense Service API.

## Prerequisites

1. Start the services:
   ```bash
   docker-compose up --build
   ```

2. Verify health:
   ```bash
   curl http://localhost:9812/health
   ```
   Expected response: `{"status":"UP"}`

3. Get a valid user ID from authservice (if needed):
   - Login or register a user through authservice
   - Extract the `X-User-Id` from the response headers

## API Endpoints

### 1. Create a Category

**Endpoint:** `POST http://localhost:9812/expense/v1/categories`

**Headers:**
```
X-User-Id: <your-user-id>
Content-Type: application/json
```

**Request Body (Top-level category):**
```json
{
  "name": "Food"
}
```

**Request Body (Sub-category with parent):**
```json
{
  "name": "Groceries",
  "parentId": 1
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:9812/expense/v1/categories \
  -H "X-User-Id: test-user-123" \
  -H "Content-Type: application/json" \
  -d '{"name": "Food"}'
```

**Expected Response (201 Created):**
```json
{
  "id": 1,
  "userId": "test-user-123",
  "name": "Food",
  "parentId": null
}
```

---

### 2. Get All Categories

**Endpoint:** `GET http://localhost:9812/expense/v1/categories`

**Headers:**
```
X-User-Id: <your-user-id>
```

**cURL Example:**
```bash
curl -X GET http://localhost:9812/expense/v1/categories \
  -H "X-User-Id: test-user-123"
```

**Expected Response (200 OK):**
```json
[
  {
    "id": 1,
    "userId": "test-user-123",
    "name": "Food",
    "parentId": null
  },
  {
    "id": 2,
    "userId": "test-user-123",
    "name": "Groceries",
    "parentId": 1
  }
]
```

---

### 3. Create an Expense

**Endpoint:** `POST http://localhost:9812/expense/v1/expenses`

**Headers:**
```
X-User-Id: <your-user-id>
Content-Type: application/json
```

**Request Body:**
```json
{
  "amount": 12.50,
  "description": "Starbucks Coffee",
  "expenseDate": "2025-11-10",
  "categoryId": 1
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:9812/expense/v1/expenses \
  -H "X-User-Id: test-user-123" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 12.50,
    "description": "Starbucks Coffee",
    "expenseDate": "2025-11-10",
    "categoryId": 1
  }'
```

**Expected Response (201 Created):**
```json
{
  "id": 1,
  "externalId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "userId": "test-user-123",
  "amount": 12.50,
  "description": "Starbucks Coffee",
  "expenseDate": "2025-11-10",
  "category": {
    "id": 1,
    "userId": "test-user-123",
    "name": "Food",
    "parentId": null
  },
  "createdAt": "2025-11-10T12:00:00.123456Z",
  "updatedAt": "2025-11-10T12:00:00.123456Z"
}
```

---

### 4. Get All Expenses

**Endpoint:** `GET http://localhost:9812/expense/v1/expenses`

**Headers:**
```
X-User-Id: <your-user-id>
```

**cURL Example:**
```bash
curl -X GET http://localhost:9812/expense/v1/expenses \
  -H "X-User-Id: test-user-123"
```

**Expected Response (200 OK):**
```json
[
  {
    "id": 1,
    "externalId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "userId": "test-user-123",
    "amount": 12.50,
    "description": "Starbucks Coffee",
    "expenseDate": "2025-11-10",
    "category": {
      "id": 1,
      "userId": "test-user-123",
      "name": "Food",
      "parentId": null
    },
    "createdAt": "2025-11-10T12:00:00.123456Z",
    "updatedAt": "2025-11-10T12:00:00.123456Z"
  }
]
```

---

### 5. Delete an Expense

**Endpoint:** `DELETE http://localhost:9812/expense/v1/expenses/{externalId}`

**Headers:**
```
X-User-Id: <your-user-id>
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:9812/expense/v1/expenses/a1b2c3d4-e5f6-7890-abcd-ef1234567890 \
  -H "X-User-Id: test-user-123"
```

**Expected Response (204 No Content):**
```
(Empty body)
```

---

## Complete Test Sequence

```bash
# 1. Create a category
curl -X POST http://localhost:9812/expense/v1/categories \
  -H "X-User-Id: test-user-123" \
  -H "Content-Type: application/json" \
  -d '{"name": "Food"}'

# 2. Get all categories (verify creation)
curl -X GET http://localhost:9812/expense/v1/categories \
  -H "X-User-Id: test-user-123"

# 3. Create an expense (use categoryId from step 1)
curl -X POST http://localhost:9812/expense/v1/expenses \
  -H "X-User-Id: test-user-123" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 12.50,
    "description": "Starbucks Coffee",
    "expenseDate": "2025-11-10",
    "categoryId": 1
  }'

# 4. Get all expenses (verify creation)
curl -X GET http://localhost:9812/expense/v1/expenses \
  -H "X-User-Id: test-user-123"

# 5. Delete the expense (use externalId from step 3)
curl -X DELETE http://localhost:9812/expense/v1/expenses/<externalId> \
  -H "X-User-Id: test-user-123"

# 6. Verify deletion
curl -X GET http://localhost:9812/expense/v1/expenses \
  -H "X-User-Id: test-user-123"
```

## Error Scenarios

### Category Not Found (Creating Expense)
```bash
curl -X POST http://localhost:9812/expense/v1/expenses \
  -H "X-User-Id: test-user-123" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 12.50,
    "description": "Test",
    "expenseDate": "2025-11-10",
    "categoryId": 999
  }'
```
**Expected:** 500 Internal Server Error with message "Category not found"

### Accessing Another User's Category
```bash
curl -X POST http://localhost:9812/expense/v1/expenses \
  -H "X-User-Id: different-user" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 12.50,
    "description": "Test",
    "expenseDate": "2025-11-10",
    "categoryId": 1
  }'
```
**Expected:** 500 Internal Server Error with message "Category not found"

## Notes

- **Date Format:** Use ISO 8601 format (YYYY-MM-DD) for `expenseDate`
- **User Isolation:** All data is scoped by `userId` - users cannot access each other's data
- **External ID:** Generated automatically as UUID for each expense
- **Hierarchical Categories:** Use `parentId` to create sub-categories
- **CORS:** Frontend at localhost:5173 and localhost:3000 are allowed
