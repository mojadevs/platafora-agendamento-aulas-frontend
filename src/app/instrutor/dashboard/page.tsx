import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import styles from "./dashboard.module.css";
import EditInstrutorForm from "./EditInstrutorForm";
import { fetchInstrutorById } from "@/app/actions/instrutor";

export default async function InstrutorDashboard() {
  const cookieStore = cookies();
  const id = cookieStore.get("user_id")?.value;
  const token = cookieStore.get("session_token")?.value;

  if (!id || !token) {
    redirect("/login");
  }

  const instrutor = await fetchInstrutorById(id);

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
      

      <section className={styles.card}>
        <EditInstrutorForm instrutor={instrutor} />
      </section>

      <section className={styles.card}>
        <h2 className={styles.aulasTitle}>📅 Aulas Agendadas</h2>
        
        <div className={styles.aulaItem}>
          <div className={styles.aulaInfo}>
            <p>João Lima</p>
            <span>14/09/2026, às 14:30</span>
          </div>
          <span className={styles.statusTag}>Confirmada</span>
        </div>

        <p className={styles.emailText} style={{textAlign: 'center', marginTop: '1rem'}}>
          Você não tem mais aulas para hoje.
        </p>
      </section>

    </div>
  </main>
);
}