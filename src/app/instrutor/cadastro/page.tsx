'use client'

import { useState } from 'react'
import { registerInstrutor } from '@/app/actions/auth'
import styles from './cadastro.module.css' 

export default function CadastroInstrutorPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError('')
    
    const result = await registerInstrutor(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <h1 className={styles.title}>Área do Instrutor</h1>
        <p className={styles.subtitle}>Cadastre-se para encontrar novos alunos</p>

        <form action={handleSubmit} className={styles.form}>
          <input name="nome" type="text" placeholder="Nome Completo" required className={styles.input} />
          <input name="email" type="email" placeholder="E-mail" required className={styles.input} />
          <input name="telefone" type="tel" placeholder="Telefone" required className={styles.input} />
          
          <input 
            name="precoHora" 
            type="number" 
            step="0.01" 
            placeholder="Preço da aula/hora (R$)" 
            required 
            className={styles.input} 
          />
          
          <input name="senha" type="password" placeholder="Senha" required className={styles.input} />

          {error && <p className={styles.errorText}>{error}</p>}

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Criando conta...' : 'Começar agora'}
          </button>
        </form>
      </div>
    </main>
  )
}