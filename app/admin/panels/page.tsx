"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Card } from "@/components/admin/Card"

export default function PanelsAdmin() {
  const [panels, setPanels] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [brand, setBrand] = useState("")
  const [model, setModel] = useState("")
  const [power, setPower] = useState("")

  async function fetchData(searchTerm = "") {
  const { data, error } = await supabase
    .rpc("search_panels", { search: searchTerm })

  if (error) {
    console.error(error)
    return
  }

  setPanels(data || [])
}

  async function addPanel() {
    if (!brand || !model || !power) return

    await supabase.from("panels").insert([
      {
        brand,
        model,
        power: Number(power),
        active: true,
      },
    ])

    setBrand("")
    setModel("")
    setPower("")
    fetchData(search)
  }

  async function toggleActive(panel: any) {
    await supabase
      .from("panels")
      .update({ active: !panel.active })
      .eq("id", panel.id)

    fetchData(search)
  }

  async function deletePanel(id: string) {
    await supabase.from("panels").delete().eq("id", id)
    fetchData(search)
  }

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchData(search)
    }, 400)

    return () => clearTimeout(delay)
  }, [search])

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Card>
      <div className="p-6 space-y-4">

        <h1 className="text-2xl font-bold">Placas Solares</h1>

        <input
          className="border p-2 rounded w-full"
          placeholder="Buscar placa..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="bg-white p-4 rounded shadow">
          <div className="grid grid-cols-3 gap-2">
            <input
              className="border p-2 rounded"
              placeholder="Marca"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
            <input
              className="border p-2 rounded"
              placeholder="Modelo"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
            <input
              className="border p-2 rounded"
              placeholder="Potência (W)"
              value={power}
              onChange={(e) => setPower(e.target.value)}
            />
          </div>

          <button
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
            onClick={addPanel}
          >
            Adicionar
          </button>
        </div>

        <div className="bg-white rounded shadow">
          {panels.map((p) => (
            <div key={p.id} className="flex justify-between p-3 border-b">
              <span>{p.brand} - {p.model} ({p.power}W)</span>

              <div className="flex gap-2">
                <button
                  className={`px-2 py-1 rounded text-white ${
                    p.active ? "bg-green-600" : "bg-gray-400"
                  }`}
                  onClick={() => toggleActive(p)}
                >
                  {p.active ? "Ativo" : "Inativo"}
                </button>

                <button
                  className="text-red-500"
                  onClick={() => deletePanel(p.id)}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </Card>
  )
}