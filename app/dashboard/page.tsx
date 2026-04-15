"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase";

export default function Dashboard() {
  const supabase = createClient();

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        window.location.replace("/login");
      }
    };

    check();
  }, []);

  return <h1>Dashboard Usuário</h1>;
}