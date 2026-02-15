'use client'

import { useState } from 'react'
import { registerAluno } from '@/app/actions/auth'
import styles from './cadastro.module.css' // 

export default function CadastroAlunoPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError('')
    
    const result = await registerAluno(formData)
    
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <h1 className={styles.title}>Criar conta de Aluno</h1>
        <p className={styles.subtitle}>Encontre o instrutor perfeito para você</p>

        <form action={handleSubmit} className={styles.form}>
          <input name="nome" type="text" placeholder="Nome Completo" required className={styles.input} />
          <input name="email" type="email" placeholder="E-mail" required className={styles.input} />
          <input name="telefone" type="tel" placeholder="Telefone (Celular)" required className={styles.input} />
          <input name="senha" type="password" placeholder="Crie uma senha" required className={styles.input} />

          {error && <p className={styles.errorText}>{error}</p>}

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar e Entrar'}
          </button>
        </form>
      </div>
    </main>
  )
}