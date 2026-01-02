"use client";
export const dynamic = "force-dynamic";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios, { AxiosInstance } from "axios";

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  api: AxiosInstance | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [api, setApi] = useState<AxiosInstance | null>(null);
  const [loading, setLoading] = useState(true);

  // Cria uma instância base do Axios (sem token)
  const baseApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: { Accept: "application/json" },
  });

  // Função para configurar o Axios com token
  const configureApi = (token: string) => {
    return axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
  };

  // Valida o token ao carregar a página
  useEffect(() => {
    const loadAuth = async () => {
      const savedToken = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (savedToken && savedUser) {
        try {
          // Valida o token com uma requisição ao backend
          const res = await baseApi.get("/api/me", {
            headers: { Authorization: `Bearer ${savedToken}` },
          });

          const validatedUser = res.data;
          setUser(validatedUser);
          setToken(savedToken);
          setApi(configureApi(savedToken));

          // Atualiza o localStorage com dados frescos
          localStorage.setItem("user", JSON.stringify(validatedUser));
        } catch (err) {
          console.error("Token inválido ou expirado", err);
          logout(); // Limpa tudo se falhar
        }
      }

      setLoading(false);
    };

    loadAuth();
  }, []);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    setApi(configureApi(newToken));
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setApi(null);
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{ user, token, api, login, logout, loading, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}