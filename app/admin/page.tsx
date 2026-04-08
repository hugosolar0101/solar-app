"use client"

import Link from "next/link"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, getUserRole } from "@/services/auth"

export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    async function checkAdmin() {
      const user = await getCurrentUser()

      if (!user) {
        router.push("/login")
        return
      }

      const role = await getUserRole()

      if (role !== "admin") {
        router.push("/dashboard")
      }
    }

    checkAdmin()
  }, [])

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Painel Administrativo</h1>

      <div className="grid grid-cols-2 gap-4">

        <Link href="/admin/inverters" className="p-4 bg-gray-100 rounded">
          ⚡ Inversores
        </Link>

        <Link href="/admin/panels" className="p-4 bg-gray-100 rounded">
          🔋 Placas
        </Link>

        <Link href="/admin/dimensioning" className="p-4 bg-gray-100 rounded">
          📊 Dimensionamento
        </Link>

        <Link href="/admin/users" className="p-4 bg-gray-100 rounded">
          👤 Usuários
        </Link>

      </div>
    </div>
  )
}