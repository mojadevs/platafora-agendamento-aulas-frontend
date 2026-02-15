"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { logout } from "@/app/actions/auth";
import styles from "./profileBox.module.css";

interface ProfileBoxProps {
  nome: string;
  role: string;
}

export default function ProfileBox({ nome, role }: ProfileBoxProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.wrapper} ref={ref}>
      <button onClick={() => setOpen(!open)} className={styles.button}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <span>Minha Conta</span>
      </button>

      {open && (
        <div className={styles.dropdown}>
          
          <div className={styles.userInfo}>
            <span className={styles.userName}>{nome}</span>
            <span className={styles.userRole}>
                {role === 'ALUNO' ? 'Aluno(a)' : 'Instrutor(a)'}
            </span>
          </div>

          {/* LÓGICA CONDICIONAL DE BOTÕES */}
          {role === "ALUNO" ? (
            <>
              {/* Botões exclusivos do Aluno */}
              <Link href="/aluno/perfil" className={styles.actionLink} onClick={() => setOpen(false)}>
                Meu Perfil
              </Link>
              <Link href="/marketplace" className={styles.actionLink} onClick={() => setOpen(false)}>
                Marketplace
              </Link>
            </>
          ) : (
            /* Botão exclusivo do Instrutor */
            <Link href="/instrutor/dashboard" className={styles.actionLink} onClick={() => setOpen(false)}>
              Meu Painel
            </Link>
          )}

          <button onClick={() => logout()} className={styles.logoutButton}>
            Sair da conta
          </button>

        </div>
      )}
    </div>
  );
}