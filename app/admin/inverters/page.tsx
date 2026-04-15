"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Card } from "@/components/admin/Card"

export default function InvertersAdmin() {
  const [inverters, setInverters] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [brand, setBrand] = useState("")
  const [model, setModel] = useState("")

  async function fetchData(searchTerm = "") {
  const { data, error } = await supabase
    .rpc("search_inverters", { search: searchTerm })

  if (error) {
    console.error(error)
    return
  }

  setInverters(data || [])
}

  async function addInverter() {
    if (!brand || !model) return

    await supabase.from("inverters").insert([
      { brand, model, active: true }
    ])

    setBrand("")
    setModel("")
    fetchData(search)
  }

  async function toggleActive(inv: any) {
    await supabase
      .from("inverters")
      .update({ active: !inv.active })
      .eq("id", inv.id)

    fetchData(search)
  }

  async function deleteInverter(id: string) {
    await supabase.from("inverters").delete().eq("id", id)
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

        <h1 className="text-2xl font-bold">Inversores</h1>

        <input
          className="border p-2 rounded w-full"
          placeholder="Buscar inversor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="bg-white p-4 rounded shadow">
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

        <div className="bg-white rounded shadow">
          {inverters.map((inv) => (
            <div key={inv.id} className="flex justify-between p-3 border-b">
              <span>{inv.brand} - {inv.model}</span>

              <div className="flex gap-2">
                <button
                  className={`px-2 py-1 rounded text-white ${
                    inv.active ? "bg-green-600" : "bg-gray-400"
                  }`}
                  onClick={() => toggleActive(inv)}
                >
                  {inv.active ? "Ativo" : "Inativo"}
                </button>

                <button
                  className="text-red-500"
                  onClick={() => deleteInverter(inv.id)}
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