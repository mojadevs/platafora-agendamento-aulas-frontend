"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const API_URL = "http://localhost:8080";

export async function updateAluno(id: string, formData: any) {
  const token = cookies().get("session_token")?.value;
  const response = await fetch(`${API_URL}/alunos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(formData), 
  });

  if (response.ok) {
    revalidatePath("/perfil");
    return { success: true };
  }

  return { success: false };
}

export async function fetchAluno(id: string, token: string) {
  const response = await fetch(`${API_URL}/alunos/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    cache: "no-store", 
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}