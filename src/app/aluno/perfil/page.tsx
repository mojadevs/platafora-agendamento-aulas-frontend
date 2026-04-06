import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import styles from "./perfil.module.css";
import EditProfileForm from "./EditProfileForm";
import { fetchAluno } from "@/app/actions/aluno";
import { getAulasAluno} from "@/app/actions/aula";

export default async function PerfilPage() {
  const cookieStore = cookies();
  const id = cookieStore.get("user_id")?.value;
  const token = cookieStore.get("session_token")?.value;

  if (!id || !token) {
    redirect("/login");
  }

  const [aluno, aulasAP, aulasAgendadas] = await Promise.all([
    fetchAluno(id, token),
    getAulasAluno(id, "AGUARDANDO_PAGAMENTO"),
    getAulasAluno(id, "AGENDADA") // Deixando pronto para o futuro
  ]);

  if (!aluno) {
    return (
      console.error("Erro ao carregar dados do perfil", id, token),
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
        
        {/* COLUNA ESQUERDA: PERFIL DO ALUNO */}
        <aside className={styles.card}>
          <EditProfileForm aluno={aluno} />
        </aside>

        {/* COLUNA DIREITA: MINHAS AULAS */}
        <div className={styles.contentColumn}>
          <section className={styles.card}>
            <h2 className={styles.aulasTitle}>📖 Minhas Aulas</h2>

            {/* SEÇÃO 1: AGUARDANDO PAGAMENTO */}
            <div className={styles.aulaSection}>
              <p className={styles.sectionLabel}>Aguardando Pagamento</p>
              {aulasAP.length > 0 ? (
                aulasAP.map((aula: any) => (
                  <div key={aula.id} className={styles.aulaItem}>
                    <div className={styles.aulaInfo}>
                      <p>Aula com {aula.instrutorNome || "Instrutor"}</p>
                      <span>{new Date(aula.dataHora + "T00:00:00").toLocaleDateString('pt-BR')}</span>
                    </div>
                    {/* Aqui futuramente você colocará o botão "Pagar" */}
                    <span className={styles.statusWaiting}>AGUARDANDO PAGAMENTO</span>
                  </div>
                ))
              ) : (
                <p className={styles.emptyState}>Você não tem pagamentos pendentes.</p>
              )}
            </div>

            <hr className={styles.divider} />

            {/* SEÇÃO 2: AGENDADAS (PAGAS) */}
            <div className={styles.aulaSection}>
              <p className={styles.sectionLabel}>Aulas Agendadas (Pagas)</p>
              {aulasAgendadas && aulasAgendadas.length > 0 ? (
                aulasAgendadas.map((aula: any) => (
                  <div key={aula.id} className={styles.aulaItem}>
                    <div className={styles.aulaInfo}>
                      <p>Aula com {aula.instrutorNome}</p>
                      <span>{new Date(aula.dataHora + "T00:00:00").toLocaleDateString('pt-BR')}</span>
                    </div>
                    <span className={styles.statusConfirmed}>Confirmada</span>
                  </div>
                ))
              ) : (
                <p className={styles.emptyState}>Nenhuma aula agendada no momento.</p>
              )}
            </div>
          </section>
        </div>

      </div>
    </main>
  );
}