"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

type User = {
  id: number;
  name?: string;
  email: string;
};

type Event = {
  id: number;
  title: string;
  date: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("auth_token")
      : null;

  useEffect(() => {
    if (!token) {
      router.push("/login");
      setLoading(false);
      return;
    }

    async function loadDashboard() {
      try {
        // 🔐 Usuário autenticado
        const userRes = await fetch(`${API_URL}/api/user`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (userRes.status === 401) {
          localStorage.removeItem("auth_token");
          router.push("/login");
          return;
        }

        const userData: User = await userRes.json();
        setUser(userData);

        // 📅 Meus eventos
        const eventsRes = await fetch(`${API_URL}/api/events`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!eventsRes.ok) {
          throw new Error("Erro ao carregar eventos");
        }

        const eventsData = await eventsRes.json();
        setEvents(eventsData.data?.data ?? []);

      } catch (err: any) {
        console.error("Erro no dashboard:", err);
        setError("Erro ao carregar dashboard");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [router, token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Carregando dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">
            Meus eventos
          </h1>
          {user && (
            <p className="text-gray-600 mt-2">
              Olá, <strong>{user.name || user.email}</strong>
            </p>
          )}
        </div>

        <button
          onClick={() => router.push("/events/create")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition font-medium"
        >
          Criar evento
        </button>
      </div>

      {/* Conteúdo */}
      {events.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              onClick={() => router.push(`/events/${event.id}`)}
              className="cursor-pointer border rounded-xl p-6 bg-white shadow hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold mb-2">
                {event.title}
              </h3>
              <p className="text-gray-500 text-sm">
                {new Date(event.date).toLocaleDateString("pt-BR")}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-gray-600 mb-6">
            Você ainda não criou nenhum evento.
          </p>
          <button
            onClick={() => router.push("/events/create")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition"
          >
            Criar meu primeiro evento
          </button>
        </div>
      )}
    </div>
  );
}
