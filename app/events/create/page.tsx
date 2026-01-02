"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  AlertCircle,
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";

import Button from "@/app/components/ui/button/Button";
import Input from "@/app/components/ui/input/Input";
import Textarea from "@/app/components/ui/textarea/Textarea";
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

export default function CreateEventPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    city: "",
    is_public: true,
    image: null as File | null,
    items: [] as string[],

    // PAGAMENTO
    price: "",
    is_paid: false,
  });

  const [newItem, setNewItem] = useState("");

  /* ===============================
     AUTH CHECK
  =============================== */
  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem("auth_token");

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

        if (!res.ok) {
          localStorage.removeItem("auth_token");
          router.push("/login");
          return;
        }

        const data = await res.json();
        setUser(data);
      } catch {
        localStorage.removeItem("auth_token");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  /* ===============================
     HANDLERS
  =============================== */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: checked !== undefined ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));

    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const addItem = () => {
    if (!newItem.trim()) return;

    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, newItem.trim()],
    }));

    setNewItem("");
  };

  const removeItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  /* ===============================
     VALIDATION
  =============================== */
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Título obrigatório";
    if (!formData.description.trim())
      newErrors.description = "Descrição obrigatória";
    if (!formData.date) newErrors.date = "Data obrigatória";
    if (!formData.city.trim()) newErrors.city = "Cidade obrigatória";

    if (formData.price && Number(formData.price) < 0) {
      newErrors.price = "Preço inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ===============================
     SUBMIT
  =============================== */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        router.push("/login");
        return;
      }

      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("description", formData.description);
      payload.append("date", formData.date);
      payload.append("city", formData.city);
      payload.append("private", formData.is_public ? "0" : "1");

      // PAGAMENTO 
      payload.append("price", formData.price || "0");
      payload.append("is_paid", Number(formData.price) > 0 ? "1" : "0");

      formData.items.forEach((item) => {
        payload.append("items[]", item);
      });

      if (formData.image) {
        payload.append("image", formData.image);
      }


      const res = await fetch(`${API_URL}/api/events`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({
          general: data.message || "Erro ao criar evento",
        });
        return;
      }

      alert("Evento criado com sucesso!");
    } catch (err) {
      setErrors({
        general: "Erro de conexão com o servidor",
      });
    } finally {
      setSubmitting(false);
    }
  };

  /* ===============================
     RENDER
  =============================== */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <Card className="w-full max-w-4xl mx-auto shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">
            Criar Novo Evento
          </CardTitle>
          <CardDescription>
            Preencha os detalhes do seu evento
          </CardDescription>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <Input
                label="Título"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={errors.title}
              />

              <Textarea
                label="Descrição"
                name="description"
                value={formData.description}
                onChange={handleChange}
                error={errors.description}
                rows={5}
              />

              <Input
                type="date"
                label="Data"
                name="date"
                value={formData.date}
                onChange={handleChange}
                error={errors.date}
              />

              <Input
                label="Cidade"
                name="city"
                value={formData.city}
                onChange={handleChange}
                error={errors.city}
              />

              {/* PREÇO */}
              <Input
                label="Preço do ingresso (R$)"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    price: value,
                    is_paid: Number(value) > 0,
                  }));
                }}
                error={errors.price}
                placeholder="0.00 (gratuito)"
              />

              {/* IMAGEM */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Imagem (opcional)
                </label>
                <label className="cursor-pointer inline-flex items-center gap-2 border px-4 py-2 rounded">
                  <Upload className="h-4 w-4" />
                  Escolher imagem
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {previewImage && (
                  <img
                    src={previewImage}
                    className="mt-3 h-24 w-24 object-cover rounded"
                  />
                )}
              </div>

              {/* ITENS */}
              <div>
                <label className="block font-medium mb-2">
                  Itens opcionais
                </label>

                <div className="flex gap-2">
                  <Input
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), addItem())
                    }
                  />
                  <Button type="button" onClick={addItem}>
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar
                  </Button>
                </div>

                <ul className="mt-3 space-y-2">
                  {formData.items.map((item, i) => (
                    <li
                      key={i}
                      className="flex justify-between border p-2 rounded"
                    >
                      {item}
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeItem(i)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>

              {errors.general && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Erro</AlertTitle>
                  <AlertDescription>
                    {errors.general}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard")}
                  className="flex-1"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Criar Evento
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
