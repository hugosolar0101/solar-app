"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";

export default function UpdatePasswordPage() {
  const supabase = createClient();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert("Senha atualizada com sucesso!");
      window.location.href = "/login";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">Nova senha</h1>

      <input
        className="border p-2"
        type="password"
        placeholder="Nova senha"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="bg-green-500 text-white px-4 py-2"
        onClick={handleUpdate}
        disabled={loading}
      >
        {loading ? "Salvando..." : "Atualizar senha"}
      </button>
    </div>
  );
}