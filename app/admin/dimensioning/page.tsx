"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Card } from "@/components/admin/Card"


export default function DimensioningAdmin() {
  const [dimensioning, setDimensioning] = useState<any[]>([])
  const [inverters, setInverters] = useState<any[]>([])
  const [panels, setPanels] = useState<any[]>([])

  const [search, setSearch] = useState("")
  const [selectedInverter, setSelectedInverter] = useState("")
  const [selectedPanel, setSelectedPanel] = useState("")
  const [max, setMax] = useState("")

  async function fetchData(searchTerm = "") {
  const { data, error } = await supabase
    .rpc("search_dimensioning", { search: searchTerm })

  if (error) {
    console.error(error)
    return
  }

  setDimensioning(data || [])
}

  async function fetchInverters() {
    const { data } = await supabase.from("inverters").select("*")
    setInverters(data || [])
  }

  async function fetchPanels() {
    const { data } = await supabase.from("panels").select("*")
    setPanels(data || [])
  }

  async function addItem() {
    if (!selectedInverter || !selectedPanel || !max) return

    await supabase.from("dimensioning").insert([
      {
        inverter_id: selectedInverter,
        panel_id: selectedPanel,
        max_quantity: Number(max),
        active: true,
      },
    ])

    setMax("")
    fetchData(search)
  }

  async function toggleActive(item: any) {
    await supabase
      .from("dimensioning")
      .update({ active: !item.active })
      .eq("id", item.id)

    fetchData(search)
  }

  async function deleteItem(id: string) {
    await supabase.from("dimensioning").delete().eq("id", id)
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
    fetchInverters()
    fetchPanels()
  }, [])

  return (
    <Card>
      <div className="p-6 space-y-4">

        <h1 className="text-2xl font-bold">Dimensionamento</h1>

        <input
          className="border p-2 rounded w-full"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="bg-white p-4 rounded shadow space-y-4">
          <div className="grid grid-cols-3 gap-2">

            <select
              className="border p-2 rounded"
              value={selectedInverter}
              onChange={(e) => setSelectedInverter(e.target.value)}
            >
              <option value="">Inversor</option>
              {inverters.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.brand} - {i.model}
                </option>
              ))}
            </select>

            <select
              className="border p-2 rounded"
              value={selectedPanel}
              onChange={(e) => setSelectedPanel(e.target.value)}
            >
              <option value="">Placa</option>
              {panels.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.brand} - {p.model}
                </option>
              ))}
            </select>

            <input
              className="border p-2 rounded"
              placeholder="Máx placas"
              value={max}
              onChange={(e) => setMax(e.target.value)}
            />
          </div>

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={addItem}
          >
            Adicionar
          </button>
        </div>

        <div className="bg-white rounded shadow">
          {dimensioning.map((d) => (
            <div key={d.id} className="flex justify-between p-3 border-b">
              <span>
                {d.inverter_brand} {d.inverter_model} →
                {d.panel_brand} {d.panel_model} =
                <strong> {d.max_quantity}</strong>
              </span>

              <div className="flex gap-2">
                <button
                  className={`px-2 py-1 rounded text-white ${
                    d.active ? "bg-green-600" : "bg-gray-400"
                  }`}
                  onClick={() => toggleActive(d)}
                >
                  {d.active ? "Ativo" : "Inativo"}
                </button>

                <button
                  className="text-red-500"
                  onClick={() => deleteItem(d.id)}
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