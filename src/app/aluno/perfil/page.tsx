import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import styles from "./perfil.module.css";
import EditProfileForm from "./EditProfileForm";

export async function fetchAluno(id: string, token: string) {
  const response = await fetch(`http://localhost:8080/alunos/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    cache: "no-store", 
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export default async function PerfilPage() {
  const cookieStore = cookies();
  const id = cookieStore.get("user_id")?.value;
  const token = cookieStore.get("session_token")?.value;

  if (!id || !token) {
    redirect("/login");
  }

  const aluno = await fetchAluno(id, token);

  if (!aluno) {
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
      <div className={styles.card}>
        <EditProfileForm aluno={aluno} />
      </div>
    </main>
  );
}