import styles from "./chat.module.css";

export default function ChatMainPage() {
  return (
    <div className={styles.container}>
      <div className={styles.emptyState}>
        <p>Selecione uma aula agendada para iniciar uma conversa com seu instrutor ou aluno.</p>
      </div>
    </div>
  );
}