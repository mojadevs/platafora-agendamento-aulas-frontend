"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import styles from "./cadastroBox.module.css";

export default function CadastroBox() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Fecha ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.wrapper} ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={styles.button}
      >
        Cadastre-se
      </button>

      {open && (
        <div className={styles.dropdown}>
            <div className={styles.itemContainer}>
                <img src="icon-aluno.png" className={styles.iconAluno} />
                <Link href="/aluno/cadastro">
                    Aluno
                </Link>
            </div>
            <div className={styles.itemContainer}>
                <img src="icon-instrutor.png" className={styles.iconInstrutor} />
                <Link href="/instrutor/cadastro">
                    Instrutor
                </Link>
            </div>
        </div>
      )}
    </div>
  );
}
