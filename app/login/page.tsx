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

    setLoading(false);

    if (error || !data.session) {
      alert(error?.message || "Erro ao logar");
      return;
    }

    const userId = data.user.id;

    // 🔥 BUSCA ROLE REAL (NUNCA use metadata)
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    const role = profile?.role;

    if (role === "admin") {
      window.location.replace("/admin");
    } else {
      window.location.replace("/dashboard");
    }
  };

  return (
    <div className="flex flex-col gap-3 items-center justify-center h-screen">
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2"
      />

      <input
        placeholder="Senha"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2"
      />

      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Entrando..." : "Login"}
      </button>
    </div>
  );
}