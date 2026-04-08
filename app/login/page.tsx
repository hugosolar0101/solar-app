"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) return alert(error.message)

    router.push("/dashboard")
  }

  async function handleRegister() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) return alert(error.message)

    alert("Verifique seu email!")
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="p-6 border rounded w-80">
        <h1 className="text-xl mb-4">Login</h1>

        <input
          className="border p-2 w-full mb-2"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border p-2 w-full mb-2"
          placeholder="Senha"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin} className="bg-blue-600 text-white w-full p-2 mb-2">
          Entrar
        </button>

        <button onClick={handleRegister} className="border w-full p-2">
          Criar conta
        </button>
      </div>
    </div>
  )
}