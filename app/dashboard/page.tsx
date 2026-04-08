"use client"

import Selector from "./components/Selector"

export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Dimensionamento Solar</h1>
      <Selector />
    </div>
  )
}