"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchMe } from "@/lib/me";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

type EventInfo = {
  id: number;
  title?: string;
  price: number;
};

export default function CheckoutPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const router = useRouter();

  const [event, setEvent] = useState<EventInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ===============================
     AUTH
  =============================== */
  useEffect(() => {
    async function checkAuth() {
      const me = await fetchMe();
      if (!me) router.push("/login");
    }
    checkAuth();
  }, [router]);

  /* ===============================
     LOAD EVENT
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

        if (!res.ok) throw new Error("Evento não encontrado");

        const json = await res.json();
        setEvent(json.data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, [eventId]);

  /* ===============================
     PAY
  =============================== */
  async function handlePayment() {
    try {
      setPaying(true);

      const token = localStorage.getItem("auth_token");
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch(
        `${API_URL}/api/events/${eventId}/checkout`,
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
        throw new Error(json?.message || "Erro ao iniciar pagamento");
      }

      const json = await res.json();

      if (!json?.init_point) {
        throw new Error("Link de pagamento inválido");
      }

      window.location.href = json.init_point;
    } catch (e: any) {
      alert(e.message);
    } finally {
      setPaying(false);
    }
  }

  /* ===============================
     RENDER
  =============================== */
  if (loading) return <p className="text-center mt-10">Carregando checkout...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
  if (!event) return null;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Checkout</h1>

      <div className="border rounded p-4 mb-6">
        <p className="text-lg font-medium">Evento #{event.id}</p>
        <p className="text-gray-600">
          Valor: <strong>R$ {Number(event.price).toFixed(2)}</strong>
        </p>
      </div>

      <button
        onClick={handlePayment}
        disabled={paying}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded text-lg"
      >
        {paying ? "Redirecionando..." : "Pagar agora"}
      </button>

      <button
        onClick={() => router.back()}
        className="mt-4 w-full text-center underline text-gray-600"
      >
        Voltar
      </button>
    </div>
  );
}
