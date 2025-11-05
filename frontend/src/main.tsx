import React from "react";
import ReactDOM from "react-dom/client";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import App from "./App";
import "./index.css";
import Analysis from "./pages/Analysis";
import Community from "./pages/Community";
import Dashboard from "./pages/Dashboard";
import Market from "./pages/Market";
import Portfolio from "./pages/Portfolio";
import Support from "./pages/Support";
import Login from "./pages/Login";
import { AuthProvider } from "./providers/AuthProvider";
import { ProtectedRoute } from "./components/shared/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "portfolio", element: <Portfolio /> },
      { path: "analysis", element: <Analysis /> },
      { path: "market", element: <Market /> },
      { path: "community", element: <Community /> },
      { path: "support", element: <Support /> },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
