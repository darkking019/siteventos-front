const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export type MeResponse = {
  success: boolean;
  data: {
    id: number;
    name: string;
    email: string;
  };
};

export async function fetchMe() {
  const token = localStorage.getItem("auth_token");
  if (!token) return null;

  const res = await fetch(`${API_URL}/api/me`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) return null;

  const json: MeResponse = await res.json();
  return json.data; 
}
