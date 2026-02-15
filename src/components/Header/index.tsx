import Link from "next/link";
import { cookies } from "next/headers"; 
import styles from "./index.module.css";
import CadastroBox from "../cadastroBox"; 
import ProfileBox from "../ProfileBox"; 

export default function Header() {
  // Lendo os cookies
  const token = cookies().get("session_token")?.value;
  const role = cookies().get("user_role")?.value;
  const nome = cookies().get("user_name")?.value;

  const isLoggedIn = !!token;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        
        <Link href="/" className={styles.logo}>
          JadeDrive
        </Link>

        <nav className={styles.actions}>
          
          {isLoggedIn ? (
            <ProfileBox 
                nome={nome || "Usuário"} 
                role={role || "ALUNO"} 
            />
          ) : (
            <>
              <Link href="/login" className={styles.login}>
                Login
              </Link>
              <CadastroBox />
            </>
          )}

        </nav>
      </div>
    </header>
  );
}