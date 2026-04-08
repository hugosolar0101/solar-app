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

      {/* TÍTULO */}
      <h1 className="text-2xl font-bold">Inversores</h1>

      {/* FORM */}
      <div className="bg-white p-4 rounded shadow space-y-4">
        <h2 className="text-xl font-semibold">Adicionar Inversor</h2>

        <div className="flex gap-2">
          <input
            className="border p-2 rounded w-full"
            placeholder="Marca"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />

          <input
            className="border p-2 rounded w-full"
            placeholder="Modelo"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />

          <button
            className="bg-blue-600 text-white px-4 rounded"
            onClick={addInverter}
          >
            Adicionar
          </button>
        </div>
      </div>

      {/* 🔥 LISTA (ERA ISSO QUE FALTAVA) */}
      <div className="bg-white rounded shadow">
        {inverters.length === 0 && (
          <div className="p-4 text-gray-500">
            Nenhum inversor cadastrado
          </div>
        )}

        {inverters.map((inv) => (
          <div
            key={inv.id}
            className="flex justify-between p-3 border-b"
          >
            <span>{inv.brand} - {inv.model}</span>

            <button
              className="text-red-500"
              onClick={() => deleteInverter(inv.id)}
            >
              Excluir
            </button>
          </div>
        ))}
      </div>

    </div>
  )
}