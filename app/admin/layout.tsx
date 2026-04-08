"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { getCurrentUser, getUserRole } from "@/services/auth"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
    <div className="flex min-h-screen">

      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-900 text-white p-6 space-y-6">
        <h2 className="text-xl font-bold">⚡ Solar Admin</h2>

        <nav className="flex flex-col gap-3">
          <Link href="/admin" className="hover:text-yellow-400">
            Dashboard
          </Link>

          <Link href="/admin/inverters" className="hover:text-yellow-400">
            Inversores
          </Link>

          <Link href="/admin/panels" className="hover:text-yellow-400">
            Placas
          </Link>

          <Link href="/admin/dimensioning" className="hover:text-yellow-400">
            Dimensionamento
          </Link>

          <Link href="/admin/users" className="hover:text-yellow-400">
            Usuários
          </Link>
        </nav>
      </aside>

      {/* CONTEÚDO */}
      <main className="flex-1 p-8 bg-gray-100">
        {children}
      </main>

    </div>
  )
}