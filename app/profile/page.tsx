"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, User, Mail, Calendar, Edit, ArrowLeft } from "lucide-react";

import Button from "@/app/components/ui/button/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card/Card";
import { Alert, AlertTitle, AlertDescription } from "@/app/components/ui/alert/Alert";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

type User = {
  id: number;
  name: string;
  email: string;
  created_at?: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      const token = localStorage.getItem("auth_token"); // ← Use "auth_token" consistente

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/user`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          localStorage.removeItem("auth_token");
          router.push("/login");
          return;
        }

        if (!res.ok) {
          throw new Error("Erro ao carregar perfil");
        }

        const data = await res.json();
        setUser(data);
      } catch (err: any) {
        console.error("Erro no perfil:", err);
        setError("Não foi possível carregar seu perfil. Tente novamente.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-lg text-gray-700">Carregando seu perfil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
        <Card className="w-full max-w-md shadow-2xl border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl text-red-600">Erro ao carregar perfil</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Ops!</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button
              onClick={() => router.refresh()}
              className="mt-6 w-full"
              variant="outline"
            >
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-lg mx-auto shadow-2xl border border-gray-200">
        <CardHeader className="text-center space-y-1">
          <div className="mx-auto bg-indigo-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
            <User className="h-8 w-8 text-indigo-600" />
          </div>
          <CardTitle className="text-3xl font-bold">Meu Perfil</CardTitle>
          <CardDescription>
            Gerencie suas informações pessoais
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-100 p-3 rounded-full">
                <User className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Nome completo</p>
                <p className="text-lg font-medium">{user.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-gray-100 p-3 rounded-full">
                <Mail className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">E-mail</p>
                <p className="text-lg font-medium">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-gray-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Membro desde</p>
                <p className="text-lg font-medium">
                  {user.created_at
                    ? new Date(user.created_at).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                    : "Data não disponível"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
            <Button
              onClick={() => router.push("/dashboard")}
              variant="outline"
              className="flex-1"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao dashboard
            </Button>

            <Button
              onClick={() => alert("Funcionalidade de editar perfil em desenvolvimento!")}
              className="flex-1"
            >
              <Edit className="mr-2 h-4 w-4" />
              Editar perfil
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}