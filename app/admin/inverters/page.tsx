"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Card } from "@/components/admin/Card"

export default function InvertersAdmin() {
  const [inverters, setInverters] = useState<any[]>([])
  const [brand, setBrand] = useState("")
  const [model, setModel] = useState("")
  const [loading, setLoading] = useState(false)

  async function fetchData() {
    const { data, error } = await supabase.from("inverters").select("*")

    if (error) {
      console.error("Erro ao buscar inversores:", error)
      return
    }

    setInverters(data || [])
  }

  async function addInverter() {
    if (!brand || !model) return

    setLoading(true)

    const { data, error } = await supabase
      .from("inverters")
      .insert([{ brand, model }])
      .select()

    if (error) {
      console.error("Erro ao inserir inversor:", error)
      setLoading(false)
      return
    }

    console.log("Inserido com sucesso:", data)

    setBrand("")
    setModel("")

    await fetchData()

    setLoading(false)
  }

  async function deleteInverter(id: string) {
    const { error } = await supabase
      .from("inverters")
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
  }, [])

  return (
    <Card>
      <div className="p-6 space-y-4">

        <h1 className="text-2xl font-bold">Inversores</h1>

        {/* FORM */}
        <div className="bg-white p-4 rounded shadow space-y-4">
          <h2 className="text-xl font-semibold">
            Adicionar Inversor
          </h2>

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
              className={`px-4 rounded text-white ${
                loading
                  ? "bg-gray-400"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              onClick={addInverter}
              disabled={loading}
            >
              {loading ? "Salvando..." : "Adicionar"}
            </button>
          </div>
        </div>

        {/* LISTA */}
        <div className="bg-white rounded shadow">
          {inverters.length === 0 && (
            <div className="p-4 text-gray-500">
              Nenhum inversor cadastrado
            </div>
          )}

          {inverters.map((inv) => (
            <div
              key={inv.id}
              className="flex justify-between p-3 border-b"
            >
              <span>
                {inv.brand} - {inv.model}
              </span>

              <button
                className="text-red-500"
                onClick={() => deleteInverter(inv.id)}
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