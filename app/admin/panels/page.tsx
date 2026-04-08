"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function PanelsAdmin() {
  const [panels, setPanels] = useState<any[]>([])
  const [brand, setBrand] = useState("")
  const [model, setModel] = useState("")

  async function fetchData() {
    const { data } = await supabase.from("panels").select("*")
    setPanels(data || [])
  }

  async function addPanel() {
    if (!brand || !model) return

    await supabase.from("panels").insert([{ brand, model }])
    setBrand("")
    setModel("")
    fetchData()
  }

  async function deletePanel(id: string) {
    await supabase.from("panels").delete().eq("id", id)
    fetchData()
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Placas</h1>

      <div className="flex gap-2">
        <input placeholder="Marca" value={brand} onChange={(e) => setBrand(e.target.value)} />
        <input placeholder="Modelo" value={model} onChange={(e) => setModel(e.target.value)} />
        <button onClick={addPanel}>Adicionar</button>
      </div>

      <ul>
        {panels.map((p) => (
          <li key={p.id} className="flex justify-between">
            {p.brand} - {p.model}
            <button onClick={() => deletePanel(p.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  )
}