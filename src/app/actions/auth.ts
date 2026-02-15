'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const API_URL = 'http://localhost:8080';

export async function login(formData: FormData) {
  const email = formData.get('email')
  const senha = formData.get('senha')

  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha }),
  })

  if (!response.ok) {
    return { error: 'Credenciais inválidas' }
  }

  const data = await response.json()
  
  createSession(data.token, data.role, data.nome, data.id)

  if (data.role === 'ALUNO') {
    redirect('/marketplace')
  } else {
    redirect('/instrutor/dashboard')
  }
}

export async function registerAluno(formData: FormData) {
  const rawData = {
    nome: formData.get('nome'),
    email: formData.get('email'),
    senha: formData.get('senha'),
    telefone: formData.get('telefone'),
    ativo: true 
  }
  const response = await fetch(`${API_URL}/alunos/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rawData),
  })

  if (!response.ok) {
    return { error: 'Erro ao cadastrar aluno' }
  }

  const data = await response.json()

  if (data.token) {
    if (data.token) {
    createSession(data.token, 'ALUNO', data.nome, data.id)
    redirect('/marketplace')
  }
  }
}


export async function registerInstrutor(formData: FormData) {
  const rawData = {
    nome: formData.get('nome'),
    email: formData.get('email'),
    senha: formData.get('senha'),
    telefone: formData.get('telefone'),
    precoHora: Number(formData.get('precoHora')),
    ativo: true
  }

  const response = await fetch(`${API_URL}/instrutores/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rawData),
  })

  if (!response.ok) {
    return { error: 'Erro ao cadastrar instrutor' }
  }

  const data = await response.json()

  if (data.token) {
    createSession(data.token, 'INSTRUTOR', data.nome, data.id)
    redirect('/instrutor/dashboard')
  }
}

async function createSession(token: string, role: string, nome: string, id: string) {
  const cookieStore = cookies()
  
  cookieStore.set('session_token', token, {
    httpOnly: true,
    maxAge: 60 * 60 * 2,
    path: '/',
  })

  cookieStore.set('user_role', role, {
    httpOnly: true,
    maxAge: 60 * 60 * 2,
    path: '/',
  })
  
  cookieStore.set('user_name', nome, {
    httpOnly: true,
    maxAge: 60 * 60 * 2,
    path: '/',
  })

  cookieStore.set('user_id', id, {
    httpOnly: true,
    maxAge: 60 * 60 * 2,
    path: '/',
  })
}
export async function logout() {
  const cookieStore = cookies()
  cookieStore.delete('session_token')
  cookieStore.delete('user_role')
  cookieStore.delete('user_name')
  cookieStore.delete('user_id')
  redirect('/login')
}