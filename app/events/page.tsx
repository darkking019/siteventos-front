"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function PublicEventsPage() {
  const router = useRouter();

  const [events, setEvents] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_URL}/api/public/events`, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || "Erro ao carregar eventos");
        }

        const data = await res.json();
        const eventsList = data.data || data.events || data || [];

        setEvents(eventsList);
      } catch (err: any) {
        console.error("Erro ao carregar eventos públicos:", err);
        setError(err.message || "Não foi possível carregar os eventos públicos.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // 🔎 FILTRO DE BUSCA
  const filteredEvents = events.filter((event) => {
    const searchText = search.toLowerCase();

    return (
      event.title?.toLowerCase().includes(searchText) ||
      event.description?.toLowerCase().includes(searchText) ||
      event.city?.toLowerCase().includes(searchText)
    );
  });

  if (loading) {
    return <p className="text-center mt-10">Carregando eventos públicos...</p>;
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Todos os Eventos Públicos</h1>

      {/* 🔎 INPUT DE BUSCA */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Buscar por título, descrição ou cidade..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {filteredEvents.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          Nenhum evento encontrado.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event: any) => (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="block transform hover:scale-105 transition duration-200"
            >
              <div className="border rounded-lg p-6 bg-white shadow hover:shadow-xl transition">
                {event.image && (
                  <img
                    src={`${API_URL}/storage/${event.image}`}
                    alt={event.title}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                )}

                <h2 className="text-2xl font-semibold mb-2">
                  {event.title}
                </h2>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {event.description || "Sem descrição"}
                </p>

                <div className="text-sm text-gray-500 space-y-1">
                  <p>📅 {new Date(event.date).toLocaleDateString("pt-BR")}</p>
                  <p>📍 {event.city}</p>
                  <p>👤 Organizador: {event.user?.name || "Anônimo"}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
