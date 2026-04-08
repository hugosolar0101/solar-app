"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function DimensioningAdmin() {
  const [dataList, setDataList] = useState<any[]>([])
  const [inverterId, setInverterId] = useState("")
  const [panelId, setPanelId] = useState("")
  const [max, setMax] = useState("")

  async function fetchData() {
    const { data } = await supabase.from("dimensioning").select("*")
    setDataList(data || [])
  }

  async function addItem() {
    await supabase.from("dimensioning").insert([
      {
        inverter_id: inverterId,
        panel_id: panelId,
        max_quantity: Number(max),
      },
    ])
    fetchData()
  }

  async function deleteItem(id: string) {
    await supabase.from("dimensioning").delete().eq("id", id)
    fetchData()
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Dimensionamento</h1>

      <div className="flex gap-2">
        <input placeholder="Inverter ID" value={inverterId} onChange={(e) => setInverterId(e.target.value)} />
        <input placeholder="Panel ID" value={panelId} onChange={(e) => setPanelId(e.target.value)} />
        <input placeholder="Máx" value={max} onChange={(e) => setMax(e.target.value)} />
        <button onClick={addItem}>Adicionar</button>
      </div>

      <ul>
        {dataList.map((d) => (
          <li key={d.id}>
            {d.inverter_id} - {d.panel_id} = {d.max_quantity}
            <button onClick={() => deleteItem(d.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  )
}