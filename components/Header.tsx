"use client"

import { createClient } from "@/lib/supabase";

export function Header({ title }: { title: string }) {

  const supabase = createClient();
  
  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = "/login"
  }

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">{title}</h1>

      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Sair
      </button>
    </div>
  )
}