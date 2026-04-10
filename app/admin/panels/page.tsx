"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Card } from "@/components/admin/Card"

export default function PanelsAdmin() {
  const [panels, setPanels] = useState<any[]>([])
  const [brand, setBrand] = useState("")
  const [model, setModel] = useState("")
  const [power, setPower] = useState("")
  const [loading, setLoading] = useState(false)

  async function fetchData() {
    const { data, error } = await supabase.from("panels").select("*")

    if (error) {
      console.error("Erro panels:", error)
      return
    }

    setPanels(data || [])
  }

  async function addPanel() {
    if (!brand || !model || !power) return

    setLoading(true)

    const { error } = await supabase.from("panels").insert([
      {
        brand,
        model,
        power: Number(power),
      },
    ])

    if (error) {
      console.error("Erro ao inserir painel:", error)
      setLoading(false)
      return
    }

    setBrand("")
    setModel("")
    setPower("")

    await fetchData()

    setLoading(false)
  }

  async function deletePanel(id: string) {
    const { error } = await supabase
      .from("panels")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Erro ao deletar painel:", error)
      return
    }

    await fetchData()
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Card>
      <div className="p-6 space-y-4">

        <h1 className="text-2xl font-bold">Placas Solares</h1>

        {/* FORM */}
        <div className="bg-white p-4 rounded shadow space-y-4">

          <h2 className="text-xl font-semibold">Adicionar Placa</h2>

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
            className={`px-4 py-2 rounded text-white ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
            onClick={addPanel}
            disabled={loading}
          >
            {loading ? "Salvando..." : "Adicionar"}
          </button>
        </div>

        {/* LISTA */}
        <div className="bg-white rounded shadow">
          {panels.length === 0 && (
            <div className="p-4 text-gray-500">
              Nenhuma placa cadastrada
            </div>
          )}

          {panels.map((p) => (
            <div key={p.id} className="flex justify-between p-3 border-b">
              <span>
                {p.brand} - {p.model} ({p.power}W)
              </span>

              <button
                className="text-red-500"
                onClick={() => deletePanel(p.id)}
              >
                Excluir
              </button>
            </div>
          ))}
        </div>

      </div>
    </Card>
  )
}