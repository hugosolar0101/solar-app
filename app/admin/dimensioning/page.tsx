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

  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)

  // 🔥 BUSCA USANDO VIEW (SEM LIMITE DE 1000)
  async function fetchDimensioning(searchTerm = "") {
    setLoading(true)

    let query = supabase
      .from("dimensioning_search")
      .select("*")
      .limit(50)

    if (searchTerm) {
      const term = `%${searchTerm}%`

      query = query.or(
        `inverter_brand.ilike.${term},inverter_model.ilike.${term},panel_brand.ilike.${term},panel_model.ilike.${term}`
      )
    }

    const { data, error } = await query

    if (error) {
      console.error("Erro ao buscar dimensionamento:", error)
      setLoading(false)
      return
    }

    setDimensioning(data || [])
    setLoading(false)
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

    setLoading(true)

    const { error } = await supabase.from("dimensioning").insert([
      {
        inverter_id: selectedInverter,
        panel_id: selectedPanel,
        max_quantity: Number(max),
        active: true,
      },
    ])

    if (error) {
      console.error(error)
      setLoading(false)
      return
    }

    setSelectedInverter("")
    setSelectedPanel("")
    setMax("")

    await fetchDimensioning(search)

    setLoading(false)
  }

  async function toggleActive(item: any) {
    const { error } = await supabase
      .from("dimensioning")
      .update({ active: !item.active })
      .eq("id", item.id)

    if (error) {
      console.error(error)
      return
    }

    fetchDimensioning(search)
  }

  async function deleteItem(id: string) {
    await supabase.from("dimensioning").delete().eq("id", id)
    fetchDimensioning(search)
  }

  // 🔥 debounce da busca
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchDimensioning(search)
    }, 400)

    return () => clearTimeout(delay)
  }, [search])

  useEffect(() => {
    fetchDimensioning()
    fetchInverters()
    fetchPanels()
  }, [])

  return (
    <Card>
      <div className="p-6 space-y-4">

        <h1 className="text-2xl font-bold">Dimensionamento</h1>

        {/* 🔍 BUSCA */}
        <input
          className="border p-2 rounded w-full"
          placeholder="Buscar inversor ou placa..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* FORM */}
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
            className={`px-4 py-2 rounded text-white ${
              loading ? "bg-gray-400" : "bg-blue-600"
            }`}
            onClick={addItem}
            disabled={loading}
          >
            {loading ? "Salvando..." : "Adicionar"}
          </button>
        </div>

        {/* LISTA */}
        <div className="bg-white rounded shadow">

          {loading && (
            <div className="p-4 text-gray-500">Carregando...</div>
          )}

          {!loading && dimensioning.length === 0 && (
            <div className="p-4 text-gray-500">
              Nenhum resultado encontrado
            </div>
          )}

          {!loading && dimensioning.map((d) => (
            <div
              key={d.id}
              className="flex justify-between items-center p-3 border-b"
            >
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