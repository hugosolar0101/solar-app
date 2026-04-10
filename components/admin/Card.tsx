import { ReactNode } from "react"

export function Card({ children }: { children: ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-4">
      {children}
    </div>
  )
}