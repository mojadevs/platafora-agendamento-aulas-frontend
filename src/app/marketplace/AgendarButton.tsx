"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { createAula } from "@/app/actions/aula";
import styles from "./marketplace.module.css";

export default function AgendarButton({ instrutor, alunoId }: { instrutor: any, alunoId: string | undefined }) {
  const [isOpen, setIsOpen] = useState(false);
  const [dataAula, setDataAula] = useState("");
  const [qtdAulas, setQtdAulas] = useState(1);
  const [mensagem, setMensagem] = useState(""); // 1. Novo estado para mensagem
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const handleAgendar = async () => {
    if (!alunoId) return alert("Por favor, faça login para agendar uma aula.");
    if (!dataAula) return alert("Selecione uma data válida.");
    if (qtdAulas < 1 || qtdAulas > 20) return alert("A quantidade de aulas deve ser entre 1 e 20.");

    setLoading(true);

    const valorCalculado = instrutor.precoHora * qtdAulas;

    const payload = {
      idAluno: Number(alunoId),
      idInstrutor: instrutor.id,
      dataHora: dataAula,
      duracao: qtdAulas, 
      status: "PENDENTE",
      valorTotal: valorCalculado,
      descricao: mensagem // 2. Enviando a mensagem para o campo 'descricao' do banco
    };

    const res = await createAula(payload);
    
    if (res.success) {
      alert(`Solicitação enviada! Valor total: ${formatMoney(valorCalculado)}`);
      setIsOpen(false);
      // Resetar estados
      setQtdAulas(1);
      setDataAula("");
      setMensagem(""); // Limpa a mensagem
    } else {
      alert("Erro ao processar agendamento.");
    }
    setLoading(false);
  };

  if (!mounted) return null;

  return (
    <>
      <button onClick={() => setIsOpen(true)} className={styles.actionButton}>
        Contatar
      </button>

      {isOpen && createPortal(
        <div className={styles.modalOverlay} onClick={() => setIsOpen(false)}>
          {/* Adicionei overflow-y-auto para garantir rolagem se o modal ficar alto */}
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 className={styles.cardTitle}>Agendar com {instrutor.nome}</h3>
            
            {/* Campo de DATA */}
            <div className={styles.infoItem} style={{ marginTop: '1.5rem' }}>
              <label className={styles.label}>Data de Início</label>
              <input 
                type="date" 
                className={styles.input}
                value={dataAula}
                onChange={(e) => setDataAula(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            {/* Campo de QUANTIDADE DE AULAS */}
            <div className={styles.infoItem} style={{ marginTop: '1rem' }}>
              <label className={styles.label}>Quantidade de Aulas (Pacote)</label>
              <input 
                type="number" 
                className={styles.input}
                min="1"
                max="20"
                value={qtdAulas}
                onChange={(e) => setQtdAulas(Number(e.target.value))}
              />
            </div>

            {/* 3. Campo de MENSAGEM / OBSERVAÇÃO */}
            <div className={styles.infoItem} style={{ marginTop: '1rem' }}>
              <label className={styles.label}>Mensagem para o Instrutor (Opcional)</label>
              <textarea 
                className={styles.input} // Reutilizando a classe input para manter a borda
                style={{ height: '80px', resize: 'none', fontFamily: 'inherit' }}
                placeholder="Ex: Gostaria de focar em conversação..."
                maxLength={100}
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                <span style={{ fontSize: '0.75rem', color: mensagem.length === 100 ? 'red' : '#9ca3af' }}>
                  {mensagem.length}/100 caracteres
                </span>
              </div>
            </div>

            {/* Exibição do TOTAL */}
            <div style={{ 
              marginTop: '1.5rem', 
              padding: '1rem', 
              backgroundColor: '#f3f4f6', 
              borderRadius: '8px',
              textAlign: 'center' 
            }}>
              <span style={{ display: 'block', fontSize: '0.9rem', color: '#555' }}>Valor Total Estimado:</span>
              <strong style={{ fontSize: '1.2rem', color: '#2563eb' }}>
                {formatMoney(instrutor.precoHora * qtdAulas)}
              </strong>
            </div>

            <div className={styles.actions}>
              <button 
                onClick={handleAgendar} 
                className={styles.saveButton}
                disabled={loading}
              >
                {loading ? "Enviando..." : "Confirmar Agendamento"}
              </button>
              <button onClick={() => setIsOpen(false)} className={styles.cancelButton}>
                Voltar
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}