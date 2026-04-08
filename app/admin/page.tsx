"use client"

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
    <div className="p-6">
      <h1 className="text-2xl">Painel Admin</h1>
    </div>
  )
}