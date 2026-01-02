"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, Mail, Phone, MapPin, LogOut, ArrowLeft } from "lucide-react";

import Button from "@/app/components/ui/button/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card/Card";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function ContatosPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

  useEffect(() => {
    async function checkUser() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/user`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else {
          localStorage.removeItem("auth_token");
        }
      } catch {
        localStorage.removeItem("auth_token");
      } finally {
        setLoading(false);
      }
    }

    checkUser();
  }, [token]);

  function logout() {
    localStorage.removeItem("auth_token");
    router.push("/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-lg text-gray-700">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-4xl mx-auto shadow-2xl border border-gray-200">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-3xl font-bold">Contatos</CardTitle>
          <CardDescription>
            {user ? `Olá, ${user.name}! Entre em contato conosco` : "Estamos aqui para ajudar"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-10">
          {/* Saudação */}
          <div className="text-center">
            {user ? (
              <p className="text-lg text-gray-700">
                Olá novamente, <strong>{user.name}</strong>!
              </p>
            ) : (
              <p className="text-lg text-gray-700">
                Página pública – você não precisa estar logado.
              </p>
            )}
          </div>

          {/* Cards de contato */}
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center space-y-4">
                <div className="mx-auto bg-indigo-100 rounded-full p-4 w-16 h-16 flex items-center justify-center">
                  <Mail className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold">E-mail</h3>
                <p className="text-gray-700">contato@meuevento.com</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center space-y-4">
                <div className="mx-auto bg-indigo-100 rounded-full p-4 w-16 h-16 flex items-center justify-center">
                  <Phone className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold">Telefone / WhatsApp</h3>
                <p className="text-gray-700">(11) 98765-4321</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center space-y-4">
                <div className="mx-auto bg-indigo-100 rounded-full p-4 w-16 h-16 flex items-center justify-center">
                  <MapPin className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold">Endereço</h3>
                <p className="text-gray-700">
                  Rua Exemplo, 123<br />
                  São Paulo – SP
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t justify-center">
            {user ? (
              <>
                <Button
                  onClick={() => router.push("/dashboard")}
                  variant="outline"
                  className="flex-1 max-w-xs flex items-center justify-center"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar para meus eventos
                </Button>

                <Button
                  onClick={logout}
                  variant="destructive"
                  className="flex-1 max-w-xs flex items-center justify-center"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => router.push("/login")}
                  className="flex-1 max-w-xs"
                >
                  Fazer login
                </Button>

                <Button
                  onClick={() => router.push("/register")}
                  variant="outline"
                  className="flex-1 max-w-xs"
                >
                  Criar conta
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}