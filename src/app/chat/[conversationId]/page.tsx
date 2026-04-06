import { PrismaClient } from "@prisma/client";
import ChatWindow from "@/components/chatWindow/chatWindow";
import styles from "../chat.module.css";

const prisma = new PrismaClient();

export default async function ConversationPage({ params }: { params: { conversationId: string } }) {
  const roomId = Number(params.conversationId);

  // 1. Busca os detalhes da sala e as mensagens
  const room = await prisma.chatRoom.findUnique({
    where: { id: roomId },
    include: {
      users: true,
      messages: {
        orderBy: { createdAt: 'asc' },
        include: { user: true }
      }
    }
  });

  if (!room) return <div>Conversa não encontrada.</div>;

  // Simulando o usuário logado (depois você pega isso do seu sistema de Auth)
  // Por enquanto, vamos fingir que somos o Aluno (ID 24 do seu print)
  const loggedUserId = 24; 

  return (
    <div className={styles.container}>
      <header className={styles.chatHeader}>
        <h3>{room.title || "Chat"}</h3>
      </header>
      
      <ChatWindow 
        initialMessages={room.messages} 
        roomId={roomId} 
        userId={loggedUserId} 
      />
    </div>
  );
}