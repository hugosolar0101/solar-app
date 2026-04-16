"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function UpdatePasswordPage() {
  const supabase = createClient();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleSession = async () => {
      // 🔥 pega hash da URL (#access_token=...)
      const hash = window.location.hash;

      if (!hash) {
        alert("Link inválido ou expirado");
        router.replace("/login");
        return;
      }

      const params = new URLSearchParams(hash.substring(1));

      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (!access_token || !refresh_token) {
        alert("Token inválido");
        router.replace("/login");
        return;
      }

      // 🔥 cria sessão manualmente
      const { error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });

      if (error) {
        alert("Erro ao validar sessão");
        router.replace("/login");
        return;
      }

      setLoading(false);
    };

    handleSession();
  }, []);

  const handleUpdatePassword = async () => {
    if (!password) {
      alert("Digite a nova senha");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Senha atualizada com sucesso!");
    router.replace("/login");
  };

  if (loading) {
    return <p>Validando sessão...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">Nova senha</h1>

      <input
        type="password"
        placeholder="Digite a nova senha"
        className="border p-2"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="bg-green-500 text-white px-4 py-2"
        onClick={handleUpdatePassword}
      >
        Atualizar senha
      </button>
    </div>
  );
}