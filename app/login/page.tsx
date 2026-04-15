"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";

export default function LoginPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
  setLoading(true);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    setLoading(false);
    alert(error.message);
    return;
  }

  // ✅ pega usuário logado
  const user = data.user;

  // 🔥 busca role na tabela profiles
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  setLoading(false);

  if (profile?.role === "admin") {
    window.location.href = "/admin";
  } else {
    window.location.href = "/dashboard";
  }
};

  const handleResetPassword = async () => {
    if (!email) {
      alert("Digite seu email primeiro");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://solar-app-topaz.vercel.app/update-password",
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Email de recuperação enviado!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">Login</h1>

      <input
        className="border p-2"
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border p-2"
        type="password"
        placeholder="Senha"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="bg-blue-500 text-white px-4 py-2"
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? "Entrando..." : "Entrar"}
      </button>

      <button
        className="text-sm text-blue-600 underline"
        onClick={handleResetPassword}
      >
        Esqueci minha senha
      </button>
    </div>
  );
}