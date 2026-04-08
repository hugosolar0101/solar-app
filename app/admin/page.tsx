"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function UsersAdmin() {
  const [users, setUsers] = useState<any[]>([])

  async function fetchUsers() {
    const { data } = await supabase.from("profiles").select("*")
    setUsers(data || [])
  }

  async function makeAdmin(id: string) {
    await supabase.from("profiles").update({ role: "admin" }).eq("id", id)
    fetchUsers()
  }

  async function makeUser(id: string) {
    await supabase.from("profiles").update({ role: "user" }).eq("id", id)
    fetchUsers()
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl">Usuários</h1>

      <ul>
        {users.map((u) => (
          <li key={u.id} className="flex justify-between">
            {u.email} ({u.role})
            <div>
              <button onClick={() => makeAdmin(u.id)}>Admin</button>
              <button onClick={() => makeUser(u.id)}>User</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}