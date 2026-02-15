"use client";

import { useState } from "react";
import { createAula } from "@/app/actions/aula";
import styles from "./marketplace.module.css";

export default function AgendarButton({ instrutor, alunoId }: { instrutor: any, alunoId: string | undefined }) {
  const [isOpen, setIsOpen] = useState(false);
  const [dataAula, setDataAula] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAgendar = async () => {
    if (!alunoId) return alert("Por favor, faça login para agendar uma aula.");
    if (!dataAula) return alert("Selecione uma data válida.");

    setLoading(true);
    const payload = {
      idAluno: Number(alunoId),
      idInstrutor: instrutor.id,
      dataHora: dataAula,
      duracao: "01:00:00", // Valor padrão conforme seu DTO
      status: "PENDENTE",
      valorTotal: instrutor.precoHora
    };

    const res = await createAula(payload);
    
    if (res.success) {
      alert("Solicitação enviada! Aguarde a confirmação do instrutor.");
      setIsOpen(false);
    } else {
      alert("Erro ao processar agendamento.");
    }
    setLoading(false);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className={styles.actionButton}>
        Contatar
      </button>

      {isOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.cardTitle}>Agendar Aula</h3>
            <p className={styles.emailText}>Instrutor: **{instrutor.nome}**</p>
            
            <div className={styles.infoItem} style={{ marginTop: '1.5rem' }}>
              <span className={styles.label}>Data Sugerida</span>
              <input 
                type="date" 
                className={styles.input}
                onChange={(e) => setDataAula(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className={styles.actions} style={{ marginTop: '2rem' }}>
              <button 
                onClick={handleAgendar} 
                className={styles.saveButton}
                disabled={loading}
              >
                {loading ? "Enviando..." : "Enviar Solicitação"}
              </button>
              <button onClick={() => setIsOpen(false)} className={styles.cancelButton}>
                Voltar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}