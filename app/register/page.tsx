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

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function RegisterPage() {
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

      const name = String(formData.get("name") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const password = String(formData.get("password") || "");
      const password_confirmation = String(formData.get("password_confirmation") || "");

      if (!name || !email || !password || !password_confirmation) {
        throw new Error("Preencha todos os campos");
      }

      if (password !== password_confirmation) {
        throw new Error("As senhas não coincidem");
      }

      const res = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation,
        }),
      });

      if (!res.ok) {
        let errorMessage = "Erro ao registrar.";

        try {
          const data = await res.json();

          // Tratamento para 422 (validação Laravel)
          if (res.status === 422) {
            errorMessage =
              data.errors?.name?.[0] ||
              data.errors?.email?.[0] ||
              data.errors?.password?.[0] ||
              data.message ||
              "Campos inválidos ou e-mail já cadastrado.";
          } else {
            errorMessage = data.message || "Erro inesperado no servidor.";
          }
        } catch (jsonErr) {
          console.error("Erro ao parsear resposta:", jsonErr);
          errorMessage = "Resposta inválida do servidor.";
        }

        throw new Error(errorMessage);
      }

      const { token, user } = await res.json();

      localStorage.setItem("auth_token", token);
      login(token, user);
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Erro no registro:", err);
      setError(err.message || "Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
      <Card className="w-full max-w-md shadow-2xl border border-gray-200">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Criar conta</CardTitle>
          <CardDescription>
            Preencha os dados abaixo para se cadastrar na plataforma
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <Input
                label="Nome completo"
                name="name"
                type="text"
                placeholder="Seu nome"
                autoComplete="name"
                required
              />

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
                autoComplete="new-password"
                required
              />

              <Input
                label="Confirme a senha"
                name="password_confirmation"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro ao criar conta</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando conta...
                </>
              ) : (
                "Criar conta"
              )}
            </Button>
          </form>

          <div className="text-center text-sm space-y-3">
            <p className="text-gray-600">
              Já tem conta?{" "}
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-700 transition"
              >
                Entre agora
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}