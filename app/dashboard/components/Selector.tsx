"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase";

export default function Selector() {
  const [inverterBrand, setInverterBrand] = useState("")
  const [inverters, setInverters] = useState<any[]>([])
  const [selectedInverter, setSelectedInverter] = useState("")

  const [panelBrand, setPanelBrand] = useState("")
  const [panels, setPanels] = useState<any[]>([])
  const [selectedPanel, setSelectedPanel] = useState("")

  const supabase = createClient();

  const [result, setResult] = useState<number | null>(null)

  // 🔹 Inversores por marca
  useEffect(() => {
    if (!inverterBrand) return

    supabase
      .from("inverters")
      .select("*")
      .eq("brand", inverterBrand)
      .then((response) => {
        setInverters(response.data || [])
      })
  }, [inverterBrand])

  // 🔹 Placas por marca
  useEffect(() => {
    if (!panelBrand) return

    supabase
      .from("panels")
      .select("*")
      .eq("brand", panelBrand)
      .then((response) => {
        setPanels(response.data || [])
      })
  }, [panelBrand])

  // 🔹 Resultado dimensionamento
  useEffect(() => {
    if (!selectedInverter || !selectedPanel) return

    supabase
      .from("dimensioning")
      .select("max_quantity")
      .eq("inverter_id", selectedInverter)
      .eq("panel_id", selectedPanel)
      .single()
      .then((response) => {
        setResult(response.data?.max_quantity ?? null)
      })
  }, [selectedInverter, selectedPanel])

  // 🔹 Realtime (atualização automática)
  useEffect(() => {
    const channel = supabase
      .channel("realtime-dimensioning")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "dimensioning" },
        () => {
          if (selectedInverter && selectedPanel) {
            supabase
              .from("dimensioning")
              .select("max_quantity")
              .eq("inverter_id", selectedInverter)
              .eq("panel_id", selectedPanel)
              .single()
              .then((response) => {
                setResult(response.data?.max_quantity ?? null)
              })
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [selectedInverter, selectedPanel])

  return (
    <div className="space-y-4">

      <select onChange={(e) => setInverterBrand(e.target.value)}>
        <option value="">Marca do inversor</option>
        <option value="Huawei">Huawei</option>
      </select>

      <select onChange={(e) => setSelectedInverter(e.target.value)}>
        <option value="">Modelo do inversor</option>
        {inverters.map((i) => (
          <option key={i.id} value={i.id}>
            {i.model}
          </option>
        ))}
      </select>

      <select onChange={(e) => setPanelBrand(e.target.value)}>
        <option value="">Marca da placa</option>
        <option value="Znshine">Znshine</option>
      </select>

      <select onChange={(e) => setSelectedPanel(e.target.value)}>
        <option value="">Modelo da placa</option>
        {panels.map((p) => (
          <option key={p.id} value={p.id}>
            {p.model}
          </option>
        ))}
      </select>

      {result !== null && (
        <div className="text-xl font-bold">
          Máximo: {result} placas
        </div>
      )}

    </div>
  )
}