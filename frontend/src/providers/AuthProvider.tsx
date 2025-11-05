import React, { createContext, useContext, useState, useEffect } from "react";
import { authClient, setAuthToken, setUserId } from "../api/client";

type AuthContextType = {
  accessToken: string | null;
  userId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type LoginResponse = {
  accessToken: string;
  token: string;
  userId: string;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [userId, setUserIdState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    const storedUserId = localStorage.getItem("user_id");

    if (storedToken && storedUserId) {
      setAccessTokenState(storedToken);
      setUserIdState(storedUserId);
      setAuthToken(storedToken);
      setUserId(storedUserId);
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Attempting login with:', { username, password: '***' });
      const response = await authClient.post<LoginResponse>(
        "/auth/v1/login",
        {
          username,
          password,
        }
      );
      console.log('Login response:', response.data);

      const { accessToken, userId } = response.data;

      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("user_id", userId);

      setAccessTokenState(accessToken);
      setUserIdState(userId);
      setAuthToken(accessToken);
      setUserId(userId);
    } catch (err: unknown) {
      console.error('Login error:', err);
      const errorMessage =
        err instanceof Error ? err.message : "Login failed. Please try again.";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
    setAccessTokenState(null);
    setUserIdState(null);
    setAuthToken(null);
    setUserId(null);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        userId,
        isAuthenticated: !!accessToken && !!userId,
        isLoading,
        login,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
