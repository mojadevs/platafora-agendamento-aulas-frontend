"use client";

import { useState } from "react";
import { aprovarAula, recusarAula } from "@/app/actions/aula";
import styles from "./dashboard.module.css";

export default function SolicitacoesList({ solicitacoesIniciais }: { solicitacoesIniciais: any[] }) {
  const [solicitacoes, setSolicitacoes] = useState(solicitacoesIniciais);

  const handleAprovar = async (aula: any) => {
    const confirm = window.confirm("Deseja aprovar esta aula?");
    if (!confirm) return;
    
    const res = await aprovarAula(aula);
    
    if (res.success) {
      setSolicitacoes((prev) => prev.filter((item) => item.id !== aula.id));
      alert("Aula aprovada!");
    } else {
      alert("Erro ao aprovar. Verifique o console.");
    }
  };

  const handleRecusar = async (id: string) => {
    const confirm = window.confirm("Recusar e excluir solicitação?");
    if (!confirm) return;
    const res = await recusarAula(id);
    if (res.success) {
      setSolicitacoes((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const formatMoney = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const formatDate = (dateString: string) => 
    new Date(dateString).toLocaleDateString('pt-BR');

  if (solicitacoes.length === 0) {
    return <div className={styles.emptyState}>Nenhuma solicitação pendente.</div>;
  }

  return (
    <div className={styles.grid}>
      {solicitacoes.map((aula) => (
        <div key={aula.id} className={styles.requestCard}>
          <div className={styles.cardHeader}>
            <span className={styles.badge}>Nova Solicitação</span>
            <span className={styles.date}>{formatDate(aula.dataHora)}</span>
          </div>
          
          <h3 className={styles.studentName}>Aluno ID: {aula.idAluno}</h3>

          <div className={styles.details}>
            <p><strong>Pacote:</strong> {aula.duracao} aula(s)</p>
            <p><strong>Total:</strong> <span className={styles.price}>{formatMoney(aula.valorTotal)}</span></p>
          </div>

          <div className={styles.actions}>
            {/* PASSAMOS O OBJETO AULA INTEIRO AQUI */}
            <button 
              onClick={() => handleAprovar(aula)} 
              className={styles.approveButton}
            >
              ✅ Aprovar
            </button>
            
            <button 
              onClick={() => handleRecusar(aula.id)} 
              className={styles.rejectButton}
            >
              ❌ Recusar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}