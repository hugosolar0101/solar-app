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
  alert(error.message);
  return;
}

const user = data.user;

// 🔥 buscar role REAL no banco
const { data: profile } = await supabase
  .from("profiles")
  .select("role")
  .eq("id", user.id)
  .single();

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
      alert("Email enviado!");
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2"
      />

      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2"
      />

      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Entrando..." : "Login"}
      </button>

      <button onClick={handleResetPassword}>
        Esqueci minha senha
      </button>
    </div>
  );
}