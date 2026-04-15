"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

export default function Dashboard() {
  const supabase = createClient();

  const [ready, setReady] = useState(false);

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        window.location.replace("/login");
        return;
      }

      setReady(true);
    };

    check();
  }, []);

  if (!ready) {
    return <div>Carregando dashboard...</div>;
  }

  return (
    <div className="p-6">
      <h1>Dashboard Usuário</h1>

      {/* 🔥 BOTÃO QUE SUMIU VOLTA AQUI */}
      <button>Cadastrar</button>
    </div>
  );
}