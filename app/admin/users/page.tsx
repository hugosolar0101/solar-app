"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Card } from "@/components/admin/Card"

export default function UsersAdmin() {
  const [users, setUsers] = useState<any[]>([])

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("user")

  async function fetchData() {
    const { data } = await supabase.from("users").select("*")
    setUsers(data || [])
  }

  async function addUser() {
    if (!name || !email) return

    await supabase.from("users").insert([
      {
        name,
        email,
        role,
      },
    ])

    setName("")
    setEmail("")
    setRole("user")
    fetchData()
  }

  async function deleteUser(id: string) {
    await supabase.from("users").delete().eq("id", id)
    fetchData()
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Card>
    <div className="p-6 space-y-4">

      <h1 className="text-2xl font-bold">Usuários</h1>

      {/* FORM */}
      <div className="bg-white p-4 rounded shadow space-y-4">
        <h2 className="text-xl font-semibold">Adicionar Usuário</h2>

        <div className="grid grid-cols-3 gap-2">
          <input
            className="border p-2 rounded"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="border p-2 rounded"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <select
            className="border p-2 rounded"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={addUser}
        >
          Adicionar
        </button>
      </div>

      {/* LISTA */}
      <div className="bg-white rounded shadow">

        {users.length === 0 && (
          <div className="p-4 text-gray-500">
            Nenhum usuário cadastrado
          </div>
        )}

        {users.map((u) => (
          <div key={u.id} className="flex justify-between p-3 border-b">
            <span>
              {u.name} - {u.email} ({u.role})
            </span>

            <button
              className="text-red-500"
              onClick={() => deleteUser(u.id)}
            >
              Excluir
            </button>
          </div>
        ))}
      </div>

    </div>
    </Card>
  )
}