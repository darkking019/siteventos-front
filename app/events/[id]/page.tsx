"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Loader2,
  AlertCircle,
  Calendar,
  MapPin,
  Users,
  Edit,
  Trash2,
  ArrowLeft,
} from "lucide-react";

import Button from "@/app/components/ui/button/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card/Card";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/app/components/ui/alert/Alert";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function EventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [event, setEvent] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ===============================
     LOAD TOKEN (CORRETO)
  =============================== */
  useEffect(() => {
    setToken(localStorage.getItem("auth_token"));
  }, []);

  /* ===============================
     LOAD EVENT + USER
  =============================== */
  useEffect(() => {
    if (!eventId) return;

    async function loadEvent() {
      try {
        setLoading(true);
        setError(null);

        // 👤 Usuário (se logado)
        if (token) {
          const userRes = await fetch(`${API_URL}/api/user`, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (userRes.ok) {
            const userData = await userRes.json();
            setUser(userData);
          }
        }

        // 📌 Evento público
        const eventRes = await fetch(
          `${API_URL}/api/public/events/${eventId}`,
          { headers: { Accept: "application/json" } }
        );

        if (!eventRes.ok) {
          throw new Error("Evento não encontrado");
        }

        const eventData = await eventRes.json();
        setEvent(eventData.data ?? eventData);

        // 👥 Participantes
        const participantsRes = await fetch(
          `${API_URL}/api/public/events/${eventId}/participants`,
          { headers: { Accept: "application/json" } }
        );

        if (participantsRes.ok) {
          const participantsData = await participantsRes.json();
          setParticipants(participantsData.data ?? []);
        }
      } catch (err) {
        console.error(err);
        setError("Evento não encontrado ou indisponível.");
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, [eventId, token]);

  /* ===============================
     DELETE EVENT
  =============================== */
  async function handleDelete() {
    if (!token) {
      router.push("/login");
      return;
    }

    if (!confirm("Tem certeza que deseja excluir este evento?")) return;

    try {
      const res = await fetch(`${API_URL}/api/events/${eventId}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Erro ao excluir evento");
      }

      router.push("/dashboard");
    } catch (err) {
      alert("Erro ao excluir evento.");
    }
  }

  /* ===============================
     STATES
  =============================== */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mr-3" />
        <p>Carregando evento...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Erro</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Ops!</AlertTitle>
              <AlertDescription>
                {error || "Evento não encontrado."}
              </AlertDescription>
            </Alert>
            <Button
              onClick={() => router.push("/")}
              className="mt-6 w-full"
              variant="outline"
            >
              Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isOwner = user?.id === event.user_id;

  /* ===============================
     RENDER
  =============================== */
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Banner */}
        <div className="mb-8 rounded-xl overflow-hidden">
          {event.image_url ? (
            <img
              src={event.image_url}
              alt={event.title}
              className="w-full h-72 object-cover"
            />
          ) : (
            <div className="h-72 bg-gray-200 flex items-center justify-center">
              Sem imagem
            </div>
          )}
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-3xl">{event.title}</CardTitle>
                <CardDescription>
                  {event.private ? "Evento privado" : "Evento público"}
                </CardDescription>
              </div>

              {isOwner && (
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() =>
                      router.push(`/events/${eventId}/edit`)
                    }
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button variant="destructive" onClick={handleDelete}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            <p>{event.description || "Sem descrição."}</p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <Calendar />
                {new Date(event.date).toLocaleDateString("pt-BR")}
              </div>
              <div className="flex items-center gap-3">
                <MapPin />
                {event.city || "Não informado"}
              </div>
              <div className="flex items-center gap-3">
                <Users />
                {participants.length} participantes
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() =>
                router.push(`/events/${eventId}/participants`)
              }
              className="w-full"
            >
              Ver participantes
            </Button>

            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
