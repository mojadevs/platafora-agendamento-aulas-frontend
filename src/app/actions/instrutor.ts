"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export interface Instrutor {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  precoHora: number;
  municipio: string;
  estado: string;
  ativo: boolean;
}

export async function fetchInstrutores(): Promise<Instrutor[]> {
  try {
    const token = cookies().get("session_token")?.value || "";
    
    const response = await fetch("http://localhost:8080/instrutores/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    return await response.json();
  } catch (error) {
    return [];
  }
}

export async function fetchInstrutorById(id: string): Promise<Instrutor | null> {
  try {
    const token = cookies().get("session_token")?.value || "";
    
    const response = await fetch(`http://localhost:8080/instrutores/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    return null;
  }
}

export async function updateInstrutor(id: number, data: any) {
  try {
    const token = cookies().get("session_token")?.value || "";
    const response = await fetch(`http://localhost:8080/instrutores/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

   if (response.ok) {
      revalidatePath("/instrutor/dashboard"); 
      return { success: true };
    }
    return { success: false };
  } catch (error) {
    return { success: false };
  }
}