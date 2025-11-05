import axios from "axios";

export const API_BASE_URLS = {
  auth: "http://localhost:9898",
  portfolio: "http://localhost:9811",
  marketData: "http://localhost:8010",
  user: "http://localhost:9810",
};

export const authClient = axios.create({
  baseURL: API_BASE_URLS.auth,
  headers: {
    "Content-Type": "application/json",
  },
});

export const portfolioClient = axios.create({
  baseURL: API_BASE_URLS.portfolio,
  headers: {
    "Content-Type": "application/json",
  },
});

export const marketDataClient = axios.create({
  baseURL: API_BASE_URLS.marketData,
  headers: {
    "Content-Type": "application/json",
  },
});

export const userClient = axios.create({
  baseURL: API_BASE_URLS.user,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    portfolioClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    marketDataClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    userClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete portfolioClient.defaults.headers.common["Authorization"];
    delete marketDataClient.defaults.headers.common["Authorization"];
    delete userClient.defaults.headers.common["Authorization"];
  }
};

export const setUserId = (userId: string | null) => {
  if (userId) {
    portfolioClient.defaults.headers.common["X-User-Id"] = userId;
    marketDataClient.defaults.headers.common["x-user-id"] = userId;
    userClient.defaults.headers.common["X-User-Id"] = userId;
  } else {
    delete portfolioClient.defaults.headers.common["X-User-Id"];
    delete marketDataClient.defaults.headers.common["x-user-id"];
    delete userClient.defaults.headers.common["X-User-Id"];
  }
};
