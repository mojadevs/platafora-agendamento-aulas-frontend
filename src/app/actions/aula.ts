"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const API_URL = "http://localhost:8080/aulas";

export async function createAula(data: any) {
  try {
    const token = cookies().get("session_token")?.value || "";
    
    const response = await fetch(`${API_URL}/`, {
      method: "POST",
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

export async function getAulasPorStatus(instrutorId: string, status: string) {
  const cookieStore = cookies();
  const token = cookieStore.get("session_token")?.value;

  try {
    const res = await fetch(`${API_URL}/status/instrutores/${instrutorId}`, {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ status: status }),
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`Erro ao buscar aulas ${status}:`, await res.text());
      return [];
    }
    
    return await res.json();
  } catch (error) {
    console.error(`Erro de conexão ao buscar ${status}:`, error);
    return [];
  }
}

export async function aprovarAula(aulaOriginal: any) {
    const cookieStore = cookies();
    const token = cookieStore.get("session_token")?.value;

  try {
    const payload = {
      idInstrutor: aulaOriginal.idInstrutor, 
      idAluno: aulaOriginal.idAluno,       
      dataHora: aulaOriginal.dataHora,
      duracao: aulaOriginal.duracao,
      valorTotal: aulaOriginal.valorTotal,
      status: "AGUARDANDO_PAGAMENTO"
    };

    const res = await fetch(`${API_URL}/${aulaOriginal.id}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    
    if (res.ok) {
      revalidatePath("/instrutor/dashboard");
      return { success: true };
    } else {
      console.error("Erro Java:", await res.text());
    }
  } catch (error) {
    console.error(error);
  }
  return { success: false };
}

export async function recusarAula(aulaId: string) {
    const cookieStore = cookies();
    const token = cookieStore.get("session_token")?.value;
  try {
    const res = await fetch(`${API_URL}/${aulaId}`, {
      method: "DELETE",
        headers: {
        "Authorization": `Bearer ${token}`
        }
    });

    if (res.ok) {
      revalidatePath("/instrutor/dashboard");
      return { success: true };
    }
  } catch (error) {
    console.error(error);
  }
  return { success: false };
}

export async function getAulasAluno(alunoId: string, status: string) {
  const cookieStore = cookies();
  const token = cookieStore.get("session_token")?.value;

  try {
    const res = await fetch(`${API_URL}/status/alunos/${alunoId}`, {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ status: status }),
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`Erro ao buscar aulas ${status}:`, await res.text());
      return [];
    }
    
    return await res.json();
  } catch (error) {
    console.error(`Erro de conexão ao buscar ${status}:`, error);
    return [];
  }
}