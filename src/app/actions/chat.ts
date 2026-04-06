"use server";

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getOrCreateChat(
  alunoId: number, 
  alunoNome: string, 
  instrutorId: number, 
  instrutorNome: string
) {
  try {
    // 1. Garante que o Aluno e Instrutor existam no banco do Chat (Upsert)
    await prisma.user.upsert({
      where: { id: alunoId },
      update: { name: alunoNome },
      create: { id: alunoId, name: alunoNome, role: "aluno" }
    });

    await prisma.user.upsert({
      where: { id: instrutorId },
      update: { name: instrutorNome },
      create: { id: instrutorId, name: instrutorNome, role: "instrutor" }
    });

    // 2. Busca se já existe uma sala que contenha EXATAMENTE esses dois usuários
    let room = await prisma.chatRoom.findFirst({
      where: {
        AND: [
          { users: { some: { id: alunoId } } },
          { users: { some: { id: instrutorId } } }
        ]
      }
    });

    // 3. Se a sala não existir, cria uma nova conectando os dois
    if (!room) {
      room = await prisma.chatRoom.create({
        data: {
          title: `Chat: ${alunoNome} e ${instrutorNome}`,
          users: {
            connect: [{ id: alunoId }, { id: instrutorId }]
          }
        }
      });
    }

    return { success: true, roomId: room.id };
  } catch (error) {
    console.error("Erro ao criar chat:", error);
    return { success: false, error: "Falha ao iniciar o chat." };
  }
}

export async function sendMessage(roomId: number, userId: number, content: string) {
  try {
    const newMessage = await prisma.message.create({
      data: {
        content,
        roomId,
        userId,
      },
    });
    return { success: true, message: newMessage };
  } catch (error) {
    return { success: false, error: "Erro ao enviar mensagem" };
  }
}