"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2, AlertCircle, Save, ArrowLeft } from "lucide-react";

import Button from "@/app/components/ui/button/Button";
import Input from "@/app/components/ui/input/Input";
import Textarea from "@/app/components/ui/textarea/Textarea"; // ← Novo componente
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card/Card";
import { Alert, AlertTitle, AlertDescription } from "@/app/components/ui/alert/Alert";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function EditEventPage() {
  const router = useRouter();
  const { id: eventId } = useParams();

  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    city: "",
    is_public: true,
    image: null as File | null,
    items: [] as string[],
  });

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    async function loadEvent() {
      try {
        const res = await fetch(`${API_URL}/api/events/${eventId}`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Não foi possível carregar o evento");

        const { data } = await res.json();

        setFormData({
          title: data.title || "",
          description: data.description || "",
          date: data.date ? data.date.split("T")[0] : "",
          city: data.city || "",
          is_public: !data.private,
          image: null,
          items: Array.isArray(data.items) ? data.items : [],
        });
      } catch (err: any) {
        console.error("Erro ao carregar evento:", err);
        setError("Não foi possível carregar os dados do evento.");
      } finally {
        setLoading(false);
      }
    }

    if (eventId) loadEvent();
  }, [eventId, router, token]);

  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setSubmitting(true);
  setError(null);

  try {
    const payload = new FormData();

   
    payload.append("_method", "PUT");

    payload.append("title", formData.title);
    payload.append("description", formData.description);
    payload.append("date", formData.date);
    payload.append("city", formData.city);
    payload.append("private", formData.is_public ? "0" : "1");

    
    formData.items.forEach((item) => {
      payload.append("items[]", item);
    });

    if (formData.image) {
      payload.append("image", formData.image);
    }

    const res = await fetch(`${API_URL}/api/events/${eventId}`, {
      method: "POST", 
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: payload,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Erro ao atualizar evento");
    }

    router.push(`/events/${eventId}`);
  } catch (err: any) {
    console.error("Erro ao atualizar:", err);
    setError(err.message || "Erro ao salvar as alterações.");
  } finally {
    setSubmitting(false);
  }
}


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-lg text-gray-700">Carregando evento...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
        <Card className="w-full max-w-md shadow-2xl border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl text-red-600">Erro</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Ops!</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button
              onClick={() => router.back()}
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-4xl mx-auto shadow-2xl border border-gray-200">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-3xl font-bold">Editar Evento</CardTitle>
          <CardDescription>
            Atualize os detalhes do seu evento
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Título */}
            <Input
              label="Título do evento"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Festa de Aniversário"
              required
            />

            {/* Descrição - Agora usa Textarea */}
            <Textarea
              label="Descrição"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva o evento..."
              rows={5}
            />

            {/* Data */}
            <Input
              label="Data do evento"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />

            {/* Cidade */}
            <Input
              label="Cidade"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="Ex: São Paulo"
              required
            />

            {/* Visibilidade */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="is_public"
                checked={formData.is_public}
                onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                className="h-5 w-5 text-indigo-600 border-gray-300 rounded"
              />
              <label htmlFor="is_public" className="text-gray-700">
                Tornar evento público (visível para todos)
              </label>
            </div>

            {/* Imagem */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagem de capa (opcional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setFormData({ ...formData, image: e.target.files[0] });
                  }
                }}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100"
              />
              {formData.image && (
                <p className="mt-2 text-sm text-gray-600">
                  Arquivo selecionado: {formData.image.name}
                </p>
              )}
            </div>

            {/* Itens */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Itens do evento
              </label>
              <ul className="space-y-2">
                {formData.items.map((item: string, index: number) => (
                  <li key={index} className="flex items-center space-x-2">
                    <Input
                      value={item}
                      onChange={(e) => {
                        const newItems = [...formData.items];
                        newItems[index] = e.target.value;
                        setFormData({ ...formData, items: newItems });
                      }}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        const newItems = formData.items.filter((_, i) => i !== index);
                        setFormData({ ...formData, items: newItems });
                      }}
                    >
                      Remover
                    </Button>
                  </li>
                ))}
              </ul>
              <Button
                type="button"
                variant="outline"
                className="mt-2"
                onClick={() => setFormData({ ...formData, items: [...formData.items, ""] })}
              >
                Adicionar item
              </Button>
            </div>

            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              <Button
                type="button"
                onClick={() => router.back()}
                variant="outline"
                className="flex-1 flex items-center justify-center"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>

              <Button
                type="submit"
                disabled={submitting}
                className="flex-1 flex items-center justify-center"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar alterações
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}