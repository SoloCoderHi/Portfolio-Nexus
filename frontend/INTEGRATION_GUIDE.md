# Portfolio Nexus - Phase 4 Integration Guide

## Overview
Phase 4 connects the frontend application to the backend microservices with full authentication and live API integration.

## 🔐 Authentication System

### Components Created
- **`src/providers/AuthProvider.tsx`**: React Context for authentication state management
- **`src/pages/Login.tsx`**: Login page with username/password form
- **`src/components/shared/ProtectedRoute.tsx`**: Route guard that redirects unauthenticated users

### Authentication Flow
1. User enters credentials on `/login`
2. POST request to `http://localhost:9898/auth/v1/login`
3. Response contains `access_token` and `user_id`
4. Tokens stored in localStorage and set in API client headers
5. All subsequent API calls include:
   - `Authorization: Bearer <token>`
   - `X-User-Id: <userId>` or `x-user-id: <userId>`

### Demo Credentials
- Username: `admin`
- Password: `password`

## 🔌 API Integration

### API Clients (`src/api/client.ts`)
Four axios clients configured for each microservice:
- **authClient**: http://localhost:9898
- **portfolioClient**: http://localhost:9811
- **marketDataClient**: http://localhost:8010
- **userClient**: http://localhost:9810

### Service Endpoints

#### Portfolio Service (`src/api/portfolioService.ts`)
- `GET /portfolio/v1/stocks` - Fetch all stock holdings
- `GET /portfolio/v1/mutual-funds` - Fetch all mutual fund holdings
- `GET /portfolio/v1/cryptos` - Fetch all crypto holdings

#### Market Data Service (`src/api/marketDataService.ts`)
- `GET /price/stock/{symbol}` - Get current stock price
- `GET /price/mf/{scheme_code}` - Get mutual fund NAV
- `GET /price/crypto/{coin_id}` - Get crypto price
- `POST /v1/ds/message` - AI search endpoint

## 📊 Updated Hooks

### ✅ `useTotalPortfolioValue` (Live API)
**Location**: `src/hooks/useTotalPortfolioValue.ts`

**Data Flow**:
1. Fetch all holdings from portfolioService (stocks, MFs, cryptos)
2. For each holding, fetch current price from marketDataService
3. Calculate:
   - Total Value = Σ(quantity × current_price)
   - Total Invested = Σ(quantity × average_cost)
   - Return Amount = Total Value - Total Invested
   - Return Percent = (Return Amount / Total Invested) × 100

**Error Handling**: Falls back to average_cost if price fetch fails

### ✅ `usePortfolioHoldings` (Live API)
**Location**: `src/hooks/usePortfolioHoldings.ts`

**Data Flow**:
1. Fetch all holdings from portfolioService
2. Enrich each holding with current market price
3. Calculate performance metrics per holding:
   - Gain/Loss Amount
   - Gain/Loss Percentage
   - Total Value
   - Total Cost

**Used By**:
- `MyPortfolioCarousel` - Asset cards
- `PortfolioOverviewTable` - Detailed table view

### ⚠️ `usePortfolioHistory` (Mock Data)
**Location**: `src/hooks/usePortfolioHistory.ts`

**Status**: Still using mock data

**Reason**: Backend `portfolioService` does not store historical portfolio snapshots. No `portfolio_history` table exists.

**Future Enhancement**: 
- Add `portfolio_history` table to portfolioService
- Create scheduled job to snapshot total portfolio value daily
- Add endpoint: `GET /portfolio/v1/history?period=1W`

### ⚠️ `useWatchlist` (Mock Data)
**Location**: `src/hooks/useWatchlist.ts`

**Status**: Still using mock data

**Reason**: Backend `portfolioService` has no Watchlist entity or endpoints.

**Future Enhancement**:
- Add `Watchlist` JPA entity to portfolioService
- Create CRUD endpoints:
  - `GET /portfolio/v1/watchlist`
  - `POST /portfolio/v1/watchlist/{symbol}`
  - `DELETE /portfolio/v1/watchlist/{symbol}`

## 🎯 Widget Status

| Widget | Hook | API Status | Notes |
|--------|------|-----------|-------|
| Total Holding Card | `useTotalPortfolioValue` | ✅ Live | Aggregates all holdings |
| My Portfolio Carousel | `usePortfolioHoldings` | ✅ Live | Shows individual assets |
| Portfolio Performance Chart | `usePortfolioHistory` | ⚠️ Mock | Needs backend support |
| Portfolio Overview Table | `usePortfolioHoldings` | ✅ Live | Detailed holdings view |
| Watchlist Table | `useWatchlist` | ⚠️ Mock | Needs backend entity |

## 🚀 Running the Application

### Prerequisites
Ensure all backend services are running:
```bash
docker-compose up -d
```

This starts:
- MySQL (port 3306)
- Kafka + Zookeeper
- authservice (port 9898)
- userservice (port 9810)
- portfolioservice (port 9811)
- marketdataservice (port 8010)

### Frontend Development Server
```bash
cd frontend
npm install
npm run dev
```

Access at: http://localhost:5173

### Production Build
```bash
npm run build
npm run preview
```

## 🔍 Testing the Integration

### 1. Login Flow
1. Navigate to http://localhost:5173
2. Should redirect to `/login`
3. Enter credentials: `admin` / `password`
4. Should redirect to Dashboard on success

### 2. Verify API Calls
Open browser DevTools > Network tab:
- Should see calls to `localhost:9811` (portfolio)
- Should see calls to `localhost:8010` (market data)
- Check request headers include `Authorization` and `X-User-Id`

### 3. Test Logout
Click logout button in header (top-right)
- Should clear localStorage
- Should redirect to `/login`
- Protected routes should be inaccessible

## 🐛 Troubleshooting

### CORS Errors
If you see CORS errors, ensure backend services have CORS configuration:
```java
@CrossOrigin(origins = "http://localhost:5173")
```

### 401 Unauthorized
- Verify token is being sent in request headers
- Check token hasn't expired
- Confirm user_id matches the authenticated user

### Empty Data
- Ensure database has seed data for test user
- Check backend service logs for errors
- Verify services can reach MySQL

### Network Errors
- Confirm all services are running: `docker-compose ps`
- Check service health: `curl http://localhost:9811/actuator/health`

## 📝 Code Structure

```
frontend/src/
├── api/
│   ├── client.ts              # Axios clients & auth setup
│   ├── portfolioService.ts    # Portfolio API calls
│   └── marketDataService.ts   # Market data API calls
├── providers/
│   └── AuthProvider.tsx       # Auth context & state
├── components/
│   ├── shared/
│   │   └── ProtectedRoute.tsx # Route protection
│   └── widgets/
│       ├── TotalHoldingCard.tsx
│       ├── MyPortfolioCarousel.tsx
│       ├── PortfolioOverviewTable.tsx
│       └── WatchlistTable.tsx
├── hooks/
│   ├── useTotalPortfolioValue.ts  # ✅ Live API
│   ├── usePortfolioHoldings.ts    # ✅ Live API
│   ├── usePortfolioHistory.ts     # ⚠️ Mock data
│   └── useWatchlist.ts            # ⚠️ Mock data
└── pages/
    ├── Login.tsx              # Login page
    └── Dashboard.tsx          # Main dashboard
```

## 🎓 Next Steps

### Immediate
1. Add proper error boundaries for API failures
2. Implement retry logic for failed requests
3. Add loading states for async operations
4. Implement refresh token mechanism

### Future Enhancements
1. **Portfolio History Tracking**
   - Backend: Add scheduled job to snapshot portfolio daily
   - Frontend: Connect chart to real historical data

2. **Watchlist Feature**
   - Backend: Create Watchlist entity and endpoints
   - Frontend: Remove mock data, add CRUD operations

3. **Real-time Updates**
   - Integrate WebSocket for live price updates
   - Add price alerts and notifications

4. **Advanced Features**
   - AI-powered search in header
   - Portfolio analytics and insights
   - Export portfolio reports
   - Multi-currency support

## 📚 Related Documentation
- [Authentication Service API](../authservice/README.md)
- [Portfolio Service API](../portfolioService/README.md)
- [Market Data Service API](../marketDataService/README.md)
