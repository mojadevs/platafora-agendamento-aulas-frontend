"use client";

import { useState } from "react";
import { sendMessage } from "@/app/actions/chat";
import styles from "../app/chat/chat.module.css";

export default function ChatWindow({ initialMessages, roomId, userId }: any) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const res = await sendMessage(roomId, userId, input);
    
    if (res.success) {
      setMessages([...messages, res.message]);
      setInput("");
    }
  };

  return (
    <>
      <div className={styles.messagesArea}>
        {messages.map((msg: any) => (
          <div 
            key={msg.id} 
            className={msg.userId === userId ? styles.myMessage : styles.theirMessage}
          >
            <p>{msg.content}</p>
            <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        ))}
      </div>

      <div className={styles.inputArea}>
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua mensagem..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Enviar</button>
      </div>
    </>
  );
}