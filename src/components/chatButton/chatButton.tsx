"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getOrCreateChat } from "@/app/actions/chat";

interface ChatButtonProps {
  alunoId: number;
  alunoNome: string;
  instrutorId: number;
  instrutorNome: string;
}

export default function ChatButton({ alunoId, alunoNome, instrutorId, instrutorNome }: ChatButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleOpenChat = async () => {
    setLoading(true);
    const res = await getOrCreateChat(alunoId, alunoNome, instrutorId, instrutorNome);
    
    if (res.success && res.roomId) {
      // Redireciona para a rota dinâmica que você criou
      router.push(`/chat/${res.roomId}`);
    } else {
      alert("Não foi possível abrir o chat no momento.");
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleOpenChat} 
      disabled={loading}
      style={{
        padding: "0.5rem 1rem",
        backgroundColor: "#0ea5e9", // Azul que combina com seu layout
        color: "white",
        border: "none",
        borderRadius: "0.5rem",
        fontWeight: "bold",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        opacity: loading ? 0.7 : 1
      }}
    >
      💬 {loading ? "Abrindo..." : "Abrir Chat"}
    </button>
  );
}