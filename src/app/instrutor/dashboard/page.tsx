import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import styles from "./dashboard.module.css";
import EditInstrutorForm from "./EditInstrutorForm";
import { fetchInstrutorById } from "@/app/actions/instrutor";
import { getAulasPorStatus } from "@/app/actions/aula"; 
import SolicitacoesList from "./SolicitacoesList";

export default async function InstrutorDashboard() {
  const cookieStore = cookies();
  const id = cookieStore.get("user_id")?.value;
  const token = cookieStore.get("session_token")?.value;

  if (!id || !token) {
    redirect("/login");
  }

  // Buscando tudo em paralelo para carregar mais rápido
  const [instrutor, solicitacoes, aguardandoPagamento] = await Promise.all([
    fetchInstrutorById(id),
    getAulasPorStatus(id, "PENDENTE"),
    getAulasPorStatus(id, "AGUARDANDO_PAGAMENTO")
  ]);

  if (!instrutor) {
    return (
      <main className={styles.main}>
        <div className={styles.card}>
          <p>Erro ao carregar dados do perfil. Tente novamente mais tarde.</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        
        {/* COLUNA ESQUERDA: PERFIL */}
        <aside className={styles.card}>
          <EditInstrutorForm instrutor={instrutor} />
        </aside>

        {/* COLUNA DIREITA: AULAS */}
        <div className={styles.contentColumn}>
          
          <section className={styles.card}>
            <h2 className={styles.aulasTitle} style={{ color: '#d97706' }}>
              🔔 Solicitações Pendentes
            </h2>
            <SolicitacoesList solicitacoesIniciais={solicitacoes} />
          </section>

          <section className={styles.card}>
            <h2 className={styles.aulasTitle}>📅 Próximas Aulas</h2>
            
            {/* SEÇÃO: AGUARDANDO PAGAMENTO */}
            <div className={styles.aulaSection}>
              <p className={styles.sectionLabel}>Aguardando Pagamento</p>
              {aguardandoPagamento.length > 0 ? (
                aguardandoPagamento.map((aula: any) => (
                  <div key={aula.id} className={styles.aulaItem}>
                    <div className={styles.aulaInfo}>
                      <p>{aula.nomeAluno || "Aluno"}</p>
                      <span>{new Date(aula.dataHora + "T00:00:00").toLocaleDateString('pt-BR')}</span>
                    </div>
                    <span className={styles.statusWaiting}>Aguardando Pagamento</span>
                  </div>
                ))
              ) : (
                <p className={styles.emptyState}>Nenhuma aula aguardando pagamento.</p>
              )}
            </div>

            <hr className={styles.divider} />

            {/* SEÇÃO: AGENDADAS (PAGAS) */}
            <div className={styles.aulaSection}>
              <p className={styles.sectionLabel}>Agendadas</p>
              <div className={styles.aulaItem}>
                <div className={styles.aulaInfo}>
                  <p>João Lima (Exemplo)</p>
                  <span>14/09/2026, às 14:30</span>
                </div>
                <span className={styles.statusConfirmed}>Confirmada</span>
              </div>
            </div>

          </section>
        </div>
      </div>
    </main>
  );
}