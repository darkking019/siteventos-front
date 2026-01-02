"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchMe } from "@/lib/me";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

type Participant = {
  id: number;
  name: string;
};

type EventInfo = {
  id: number;
  is_paid: boolean;
  price: number;
};

export default function EventParticipantsPage() {
  const params = useParams();
  const eventId = params?.id as string | undefined;
  const router = useRouter();

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [event, setEvent] = useState<EventInfo | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [userId, setUserId] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  /* ===============================
     LOAD LOGGED USER
  =============================== */
  useEffect(() => {
    async function loadUser() {
      try {
        const me = await fetchMe();

        if (!me) {
          router.push("/login");
          return;
        }

        setUserId(me.id);
      } catch {
        router.push("/login");
      }
    }

    loadUser();
  }, [router]);

  /* ===============================
     LOAD PARTICIPANTS
  =============================== */
  useEffect(() => {
    if (!eventId) return;

    async function loadParticipants() {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("auth_token");
        if (!token) {
          router.push("/login");
          return;
        }

        const res = await fetch(
          `${API_URL}/api/events/${eventId}/participants`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 404) {
          throw new Error("Evento não encontrado");
        }

        if (res.status === 403) {
          throw new Error("Você não tem permissão para ver este evento");
        }

        if (!res.ok) {
          throw new Error("Erro ao carregar participantes");
        }

        const json = await res.json();
        setParticipants(json.data ?? []);
      } catch (e: any) {
        setError(e.message || "Erro inesperado");
      } finally {
        setLoading(false);
      }
    }

    loadParticipants();
  }, [eventId, router]);

  /* ===============================
     LOAD EVENT INFO
  =============================== */
  useEffect(() => {
    if (!eventId) return;

    async function loadEvent() {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) return;

        const res = await fetch(`${API_URL}/api/events/${eventId}`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) return;

        const json = await res.json();
        setEvent(json.data);
      } catch {
        // silencioso
      }
    }

    loadEvent();
  }, [eventId]);

  /* ===============================
     JOIN EVENT (FREE)
  =============================== */
  async function joinEvent() {
    try {
      setActionLoading(true);

      const token = localStorage.getItem("auth_token");
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch(
        `${API_URL}/api/events/${eventId}/join`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.message || "Erro ao entrar no evento");
      }

      const me = await fetchMe();
      if (me) {
        setParticipants((prev) => {
          if (prev.some((p) => p.id === me.id)) return prev;
          return [...prev, { id: me.id, name: me.name }];
        });
      }
    } catch (e: any) {
      alert(e.message);
    } finally {
      setActionLoading(false);
    }
  }

  /* ===============================
     GO TO CHECKOUT (PAID)
  =============================== */
  function goToCheckout() {
    if (!eventId) return;
    router.push(`/checkout/${eventId}`);
  }

  /* ===============================
     LEAVE EVENT
  =============================== */
  async function leaveEvent() {
    try {
      setActionLoading(true);

      const token = localStorage.getItem("auth_token");
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch(
        `${API_URL}/api/events/${eventId}/leave`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.message || "Erro ao sair do evento");
      }

      setParticipants((prev) =>
        prev.filter((p) => p.id !== userId)
      );
    } catch (e: any) {
      alert(e.message);
    } finally {
      setActionLoading(false);
    }
  }

  /* ===============================
     DERIVED STATE
  =============================== */
  const isParticipant =
    userId !== null && participants.some((p) => p.id === userId);

  /* ===============================
     RENDER STATES
  =============================== */
  if (!eventId) {
    return (
      <p className="text-center mt-10 text-red-600">
        ID do evento inválido
      </p>
    );
  }

  if (loading) {
    return <p className="text-center mt-10">Carregando...</p>;
  }

  if (error) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => router.back()}
          className="underline text-blue-600"
        >
          Voltar
        </button>
      </div>
    );
  }

  /* ===============================
     RENDER
  =============================== */
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Participantes</h1>

      {/* BOTÕES */}
      {userId && (
        <div className="mb-6">
          {isParticipant ? (
            <button
              onClick={leaveEvent}
              disabled={actionLoading}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-6 py-2 rounded"
            >
              {actionLoading ? "Saindo..." : "Sair do evento"}
            </button>
          ) : event?.is_paid ? (
            <button
              onClick={goToCheckout}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
            >
              Comprar ingresso (R$ {Number(event.price).toFixed(2)})
            </button>
          ) : (
            <button
              onClick={joinEvent}
              disabled={actionLoading}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-6 py-2 rounded"
            >
              {actionLoading ? "Entrando..." : "Entrar no evento"}
            </button>
          )}
        </div>
      )}

      {/* LISTA */}
      <div className="grid gap-4">
        {participants.length === 0 && (
          <p className="text-gray-500">
            Nenhum participante ainda.
          </p>
        )}

        {participants.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between border p-4 rounded"
          >
            <span className="font-medium">{p.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
