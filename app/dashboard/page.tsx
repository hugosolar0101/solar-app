"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Card } from "@/components/admin/Card"

export default function Dashboard() {
  const [inverters, setInverters] = useState<any[]>([])
  const [panels, setPanels] = useState<any[]>([])
  const [dimensioning, setDimensioning] = useState<any[]>([])

  const [selectedInverterBrand, setSelectedInverterBrand] = useState("")
  const [selectedInverterModel, setSelectedInverterModel] = useState("")

  const [selectedPanelBrand, setSelectedPanelBrand] = useState("")
  const [selectedPanelModel, setSelectedPanelModel] = useState("")

  const [result, setResult] = useState<number | null>(null)

  // 🔹 BUSCAR DADOS DO SUPABASE
  async function fetchData() {
    const [{ data: inv }, { data: pan }, { data: dim }] =
      await Promise.all([
        supabase.from("inverters").select("*"),
        supabase.from("panels").select("*"),
        supabase.from("dimensioning").select("*"),
      ])

    setInverters(inv || [])
    setPanels(pan || [])
    setDimensioning(dim || [])
  }

  useEffect(() => {
    fetchData()
  }, [])

  // 🔹 LISTAS DE MARCAS
  const inverterBrands = [...new Set(inverters.map(i => i.brand))]
  const panelBrands = [...new Set(panels.map(p => p.brand))]

  // 🔹 FILTROS
  const filteredInverters = inverters.filter(
    (i) => i.brand === selectedInverterBrand
  )

  const filteredPanels = panels.filter(
    (p) => p.brand === selectedPanelBrand
  )

  // 🔹 PEGAR OBJETOS SELECIONADOS
  const selectedInverterObj = inverters.find(
    (i) =>
      i.brand === selectedInverterBrand &&
      i.model === selectedInverterModel
  )

  const selectedPanelObj = panels.find(
    (p) =>
      p.brand === selectedPanelBrand &&
      p.model === selectedPanelModel
  )

  // 🔥 CALCULAR AUTOMATICAMENTE
  useEffect(() => {
    if (!selectedInverterObj || !selectedPanelObj) {
      setResult(null)
      return
    }

    const match = dimensioning.find(
      (d) =>
        d.inverter_id === selectedInverterObj.id &&
        d.panel_id === selectedPanelObj.id
    )

    setResult(match?.max_quantity || 0)
  }, [selectedInverterObj, selectedPanelObj, dimensioning])

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">
          ⚡ Dimensionamento Solar
        </h1>
        <p className="text-gray-500">
          Selecione os equipamentos para calcular automaticamente
        </p>
      </div>

      {/* FORM */}
      <Card>
        <h2 className="text-lg font-semibold mb-4">
          Configurar sistema
        </h2>

        <div className="grid grid-cols-2 gap-4">

          {/* INVERSOR */}
          <div className="space-y-2">
            <select
              className="border p-2 rounded w-full"
              value={selectedInverterBrand}
              onChange={(e) => {
                setSelectedInverterBrand(e.target.value)
                setSelectedInverterModel("")
              }}
            >
              <option value="">Marca do inversor</option>
              {inverterBrands.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>

            <select
              className="border p-2 rounded w-full"
              value={selectedInverterModel}
              onChange={(e) => setSelectedInverterModel(e.target.value)}
            >
              <option value="">Modelo do inversor</option>
              {filteredInverters.map((i) => (
                <option key={i.id}>{i.model}</option>
              ))}
            </select>
          </div>

          {/* PLACA */}
          <div className="space-y-2">
            <select
              className="border p-2 rounded w-full"
              value={selectedPanelBrand}
              onChange={(e) => {
                setSelectedPanelBrand(e.target.value)
                setSelectedPanelModel("")
              }}
            >
              <option value="">Marca da placa</option>
              {panelBrands.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>

            <select
              className="border p-2 rounded w-full"
              value={selectedPanelModel}
              onChange={(e) => setSelectedPanelModel(e.target.value)}
            >
              <option value="">Modelo da placa</option>
              {filteredPanels.map((p) => (
                <option key={p.id}>{p.model}</option>
              ))}
            </select>
          </div>

        </div>
      </Card>

      {/* RESULTADO */}
      {result !== null && (
        <Card>
          <h2 className="text-lg font-semibold mb-2">
            Resultado
          </h2>

          <p className="text-3xl font-bold text-green-600">
            {result} placas máximas
          </p>

          <p className="text-gray-500 text-sm">
            Compatível com o inversor e placa selecionados
          </p>
        </Card>
      )}

    </div>
  )
}