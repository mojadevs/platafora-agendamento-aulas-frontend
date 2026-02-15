"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateAluno(id: string, formData: any) {
  const token = cookies().get("session_token")?.value;
  const response = await fetch(`http://localhost:8080/alunos/${id}`, {
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