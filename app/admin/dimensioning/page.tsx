"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Card } from "@/components/admin/Card"

export default function DimensioningAdmin() {
  const [dimensioning, setDimensioning] = useState<any[]>([])
  const [inverters, setInverters] = useState<any[]>([])
  const [panels, setPanels] = useState<any[]>([])

  const [selectedInverter, setSelectedInverter] = useState("")
  const [selectedPanel, setSelectedPanel] = useState("")
  const [max, setMax] = useState("")
  const [loading, setLoading] = useState(false)

  async function fetchData() {
    const { data, error } = await supabase.from("dimensioning").select("*")

    if (error) {
      console.error("Erro dimensioning:", error)
      return
    }

    setDimensioning(data || [])
  }

  async function fetchInverters() {
    const { data, error } = await supabase.from("inverters").select("*")

    if (error) {
      console.error("Erro inverters:", error)
      return
    }

    setInverters(data || [])
  }

  async function fetchPanels() {
    const { data, error } = await supabase.from("panels").select("*")

    if (error) {
      console.error("Erro panels:", error)
      return
    }

    setPanels(data || [])
  }

  async function addItem() {
    if (!selectedInverter || !selectedPanel || !max) return

    setLoading(true)

    const { error } = await supabase.from("dimensioning").insert([
      {
        inverter_id: selectedInverter,
        panel_id: selectedPanel,
        max_quantity: Number(max),
      },
    ])

    if (error) {
      console.error("Erro ao inserir dimensionamento:", error)
      setLoading(false)
      return
    }

    setSelectedInverter("")
    setSelectedPanel("")
    setMax("")

    await fetchData()

    setLoading(false)
  }

  async function deleteItem(id: string) {
    const { error } = await supabase
      .from("dimensioning")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Erro ao deletar:", error)
      return
    }

    await fetchData()
  }

  useEffect(() => {
    fetchData()
    fetchInverters()
    fetchPanels()
  }, [])

  return (
    <Card>
      <div className="p-6 space-y-4">

        <h1 className="text-2xl font-bold">Dimensionamento</h1>

        {/* FORM */}
        <div className="bg-white p-4 rounded shadow space-y-4">

          <h2 className="text-xl font-semibold">Adicionar</h2>

          <div className="grid grid-cols-3 gap-2">

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

            <input
              className="border p-2 rounded"
              placeholder="Máx placas"
              value={max}
              onChange={(e) => setMax(e.target.value)}
            />
          </div>

          <button
            className={`px-4 py-2 rounded text-white ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
            onClick={addItem}
            disabled={loading}
          >
            {loading ? "Salvando..." : "Adicionar"}
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
    </Card>
  )
}