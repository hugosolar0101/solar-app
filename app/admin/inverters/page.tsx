"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function InvertersAdmin() {
  const [inverters, setInverters] = useState<any[]>([])
  const [brand, setBrand] = useState("")
  const [model, setModel] = useState("")

  async function fetchData() {
    const { data } = await supabase.from("inverters").select("*")
    setInverters(data || [])
  }

  async function addInverter() {
    if (!brand || !model) return

    await supabase.from("inverters").insert([{ brand, model }])
    setBrand("")
    setModel("")
    fetchData()
  }

  async function deleteInverter(id: string) {
    await supabase.from("inverters").delete().eq("id", id)
    fetchData()
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Inversores</h1>

      <div className="flex gap-2">
        <input placeholder="Marca" value={brand} onChange={(e) => setBrand(e.target.value)} />
        <input placeholder="Modelo" value={model} onChange={(e) => setModel(e.target.value)} />
        <button onClick={addInverter}>Adicionar</button>
      </div>

      <ul>
        {inverters.map((inv) => (
          <li key={inv.id} className="flex justify-between">
            {inv.brand} - {inv.model}
            <button onClick={() => deleteInverter(inv.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  )
}