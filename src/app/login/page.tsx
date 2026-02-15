'use client'

import { useState } from 'react'
import { login } from '@/app/actions/auth'
import styles from './login.module.css'

export default function LoginPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError('')
    
    const result = await login(formData)
    
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <main className={styles.main}> 
      <div className={styles.card}>
        <h1 className={styles.title}>Bem-vindo de volta!</h1>
        <p className={styles.subtitle}>Acesse sua conta para continuar</p>

        <form action={handleSubmit} className={styles.form}>
          <input 
            name="email" 
            type="email" 
            placeholder="Seu e-mail" 
            required 
            className={styles.input} 
          />
          <input 
            name="senha" 
            type="password" 
            placeholder="Sua senha" 
            required 
            className={styles.input} 
          />
          
          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </main>
  )
}