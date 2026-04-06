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
  
  
  if (data.token) {
    
    await createSession(data.token, data.role, data.nome, data.idUsuario)

    if (data.role === 'ROLE_ALUNO') {
      redirect('/marketplace')
    } else {
      redirect('/instrutor/dashboard')
    }
  } else {
    return { error: 'Falha na autenticação' }
  }
}

export async function registerAluno(formData: FormData) {
  const rawData = {
    nome: formData.get('nome'),
    email: formData.get('email'),
    senha: formData.get('senha'),
    telefone: formData.get('telefone')
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
    console.log('Aluno cadastrado com sucesso:', data)
    createSession(data.token, 'ROLE_ALUNO', data.nome, data.idUsuario)
    redirect('/marketplace')
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
    createSession(data.token, 'ROLE_INSTRUTOR', data.nome, data.id)
    console.log('Instrutor cadastrado com sucesso:', data)
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