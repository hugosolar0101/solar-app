"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Card } from "@/components/admin/Card"
import { Header } from "@/components/Header"

export default function Dashboard() {
  const [inverters, setInverters] = useState<any[]>([])
  const [panels, setPanels] = useState<any[]>([])

  const [selectedInverterBrand, setSelectedInverterBrand] = useState("")
  const [selectedInverterModel, setSelectedInverterModel] = useState("")

  const [selectedPanelBrand, setSelectedPanelBrand] = useState("")
  const [selectedPanelModel, setSelectedPanelModel] = useState("")

  const [result, setResult] = useState<number | null>(null)
  const [hasCalculated, setHasCalculated] = useState(false)

  // 🔹 BUSCAR DADOS
  async function fetchData() {
    const [{ data: inv }, { data: pan }] = await Promise.all([
      supabase.from("inverters").select("*"),
      supabase.from("panels").select("*"),
    ])

    setInverters((inv || []).filter(i => i.active))
    setPanels((pan || []).filter(p => p.active))
  }

  useEffect(() => {
    fetchData()
  }, [])

  // 🔹 RESET CENTRAL
  function resetResult() {
    setResult(null)
    setHasCalculated(false)
  }

  // 🔹 CALCULAR (APENAS AO CLICAR)
  async function handleCalculate() {
  if (!selectedInverterObj || !selectedPanelObj) return

  setHasCalculated(true)

  const { data } = await supabase
    .from("dimensioning")
    .select("max_quantity, active")
    .eq("inverter_id", selectedInverterObj.id)
    .eq("panel_id", selectedPanelObj.id)
    .maybeSingle()

  // ❌ não existe OU está inativo
  if (!data || !data.active) {
    setResult(null)
    return
  }

  // ✅ válido
  setResult(data.max_quantity)
}

  // 🔹 LISTAS
  const inverterBrands = [...new Set(inverters.map(i => i.brand))].sort((a, b) =>
  a.localeCompare(b)
)

  const panelBrands = [...new Set(panels.map(p => p.brand))].sort((a, b) =>
  a.localeCompare(b)
)

  const filteredInverters = inverters
  .filter((i) => i.brand === selectedInverterBrand)
  .sort((a, b) => a.model.localeCompare(b.model))

  const filteredPanels = panels
  .filter((p) => p.brand === selectedPanelBrand)
  .sort((a, b) => a.model.localeCompare(b.model))

  // 🔹 SELECIONADOS
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

  const canCalculate = selectedInverterObj && selectedPanelObj

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

      <Header title="Dimensionamento Solar" />

      <div>
        <h1 className="text-3xl font-bold">
          ⚡ Dimensionamento Solar
        </h1>
        <p className="text-gray-500">
          Selecione os equipamentos e clique em calcular
        </p>
      </div>

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
                resetResult()
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
              onChange={(e) => {
                setSelectedInverterModel(e.target.value)
                resetResult()
              }}
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
                resetResult()
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
              onChange={(e) => {
                setSelectedPanelModel(e.target.value)
                resetResult()
              }}
            >
              <option value="">Modelo da placa</option>
              {filteredPanels.map((p) => (
                <option key={p.id}>{p.model}</option>
              ))}
            </select>
          </div>
        </div>

        {/* BOTÃO CALCULAR */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={handleCalculate}
            disabled={!canCalculate}
            className={`px-4 py-2 rounded font-semibold transition
              ${canCalculate
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
          >
            Calcular
          </button>
        </div>
      </Card>

      {/* RESULTADO */}
      {hasCalculated && result === null && (
  <Card>
    <p className="text-red-500 font-semibold">
      ⚠️ Dimensionamento não disponível. Contate o suporte.
    </p>
  </Card>
)}

      {hasCalculated && result !== null && (
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