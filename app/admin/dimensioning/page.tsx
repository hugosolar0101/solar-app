"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function DimensioningAdmin() {
  const [dimensioning, setDimensioning] = useState<any[]>([])

  const [inverters, setInverters] = useState<any[]>([])
  const [panels, setPanels] = useState<any[]>([])

  const [selectedInverter, setSelectedInverter] = useState("")
  const [selectedPanel, setSelectedPanel] = useState("")
  const [max, setMax] = useState("")

  // 🔹 Buscar dados
  async function fetchData() {
    const { data } = await supabase.from("dimensioning").select("*")
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

  // 🔹 Adicionar
  async function addItem() {
    if (!selectedInverter || !selectedPanel || !max) return

    await supabase.from("dimensioning").insert([
      {
        inverter_id: selectedInverter,
        panel_id: selectedPanel,
        max_quantity: Number(max),
      },
    ])

    setMax("")
    fetchData()
  }

  // 🔹 Deletar
  async function deleteItem(id: string) {
    await supabase.from("dimensioning").delete().eq("id", id)
    fetchData()
  }

  useEffect(() => {
    fetchData()
    fetchInverters()
    fetchPanels()
  }, [])

  return (
    <div className="p-6 space-y-4">

      <h1 className="text-2xl font-bold">Dimensionamento</h1>

      {/* FORM */}
      <div className="bg-white p-4 rounded shadow space-y-4">

        <h2 className="text-xl font-semibold">Adicionar</h2>

        <div className="grid grid-cols-3 gap-2">

          {/* 🔽 INVERSOR */}
          <select
            className="border p-2 rounded"
            value={selectedInverter}
            onChange={(e) => setSelectedInverter(e.target.value)}
          >
            <option value="">Selecione o inversor</option>
            {inverters.map((inv) => (
              <option key={inv.id} value={inv.id}>
                {inv.brand} - {inv.model}
              </option>
            ))}
          </select>

          {/* 🔽 PLACA */}
          <select
            className="border p-2 rounded"
            value={selectedPanel}
            onChange={(e) => setSelectedPanel(e.target.value)}
          >
            <option value="">Selecione a placa</option>
            {panels.map((p) => (
              <option key={p.id} value={p.id}>
                {p.brand} - {p.model}
              </option>
            ))}
          </select>

          {/* 🔢 MAX */}
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

      {/* LISTA */}
      <div className="bg-white rounded shadow">

        {dimensioning.map((d) => {
          const inverter = inverters.find(i => i.id === d.inverter_id)
          const panel = panels.find(p => p.id === d.panel_id)

          return (
            <div key={d.id} className="flex justify-between p-3 border-b">

              <span>
                {inverter?.brand} {inverter?.model} →
                {panel?.brand} {panel?.model} =
                <strong> {d.max_quantity}</strong>
              </span>

              <button
                className="text-red-500"
                onClick={() => deleteItem(d.id)}
              >
                Excluir
              </button>

            </div>
          )
        })}

      </div>

    </div>
  )
}