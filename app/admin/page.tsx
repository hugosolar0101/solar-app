"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

export default function AdminPage() {
  const supabase = createClient();

  const [status, setStatus] = useState<"loading" | "ok" | "deny">("loading");

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        window.location.replace("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (profile?.role === "admin") {
        setStatus("ok");
      } else {
        window.location.replace("/dashboard");
      }
    };

    check();
  }, []);

  if (status === "loading") {
    return (
      <div className="p-6">
        Carregando painel admin...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1>Painel Admin</h1>

      {/* 🔥 AQUI VOLTA TUDO DO SEU PAINEL */}
      <button>Cadastrar</button>
    </div>
  );
}