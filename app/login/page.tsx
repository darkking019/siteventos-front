"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, AlertCircle } from "lucide-react";

import Button from "@/app/components/ui/button/Button";
import Input from "@/app/components/ui/input/Input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card/Card";
import { Alert, AlertTitle, AlertDescription } from "@/app/components/ui/alert/Alert";

import { useAuth } from "@/context/AuthContext";
import Navbar from "@/app/components/navbar/Navbar";
const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const email = String(formData.get("email") || "").trim();
      const password = String(formData.get("password") || "").trim();

      if (!email || !password) {
        throw new Error("Preencha email e senha");
      }

      const loginRes = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!loginRes.ok) {
        let errorMessage = "Erro ao fazer login. Tente novamente.";

        try {
          const data = await loginRes.json();

          // Tratamento específico para 422 (validação Laravel)
          if (loginRes.status === 422) {
            errorMessage =
              data.errors?.email?.[0] ||
              data.errors?.password?.[0] ||
              data.message ||
              "Credenciais inválidas ou campos incorretos.";
          } else {
            errorMessage = data.message || "Erro inesperado no servidor.";
          }
        } catch (jsonErr) {
          console.error("Erro ao parsear resposta:", jsonErr);
          errorMessage = "Resposta inválida do servidor.";
        }

        throw new Error(errorMessage);
      }

      const { token, user } = await loginRes.json();

      localStorage.setItem("auth_token", token);
      login(token, user);
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Erro no login:", err);
      setError(err.message || "Erro ao fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
      <Card className="w-full max-w-md shadow-2xl border border-gray-200">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Bem-vindo de volta</CardTitle>
          <CardDescription>
            Entre com suas credenciais para acessar a plataforma
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                autoComplete="email"
                required
              />

              <Input
                label="Senha"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro ao entrar</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>

          <div className="text-center space-y-3 text-sm">
            <p className="text-gray-600">
              Não tem conta?{" "}
              <Link
                href="/register"
                className="font-medium text-blue-600 hover:text-blue-700 transition"
              >
                Crie uma agora
              </Link>
            </p>

            <p>
              <Link
                href="/forgot-password"
                className="text-gray-500 hover:text-gray-700 hover:underline"
              >
                Esqueceu a senha?
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}