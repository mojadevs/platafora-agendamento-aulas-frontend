"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createAula(data: any) {
  try {
    const token = cookies().get("session_token")?.value || "";
    
    const response = await fetch("http://localhost:8080/aulas/", {
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