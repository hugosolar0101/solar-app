"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, getUserRole } from "@/services/auth"
import Selector from "./components/Selector"

export default function Dashboard() {
  const router = useRouter()

  useEffect(() => {
    async function checkAccess() {
      const user = await getCurrentUser()

      if (!user) {
        router.push("/login")
        return
      }

      const role = await getUserRole()

      if (role === "admin") {
        router.push("/admin")
      }
    }

    checkAccess()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Dimensionamento Solar</h1>
      <Selector />
    </div>
  )
}