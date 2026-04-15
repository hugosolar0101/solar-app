"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

export default function AdminPage() {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      // 🔥 espera sessão realmente existir
      if (!session) {
        setTimeout(() => {
          window.location.href = "/login";
        }, 200);
        return;
      }

      const role = session.user.user_metadata?.role;

      if (role !== "admin") {
        window.location.href = "/dashboard";
        return;
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) return <p>Carregando...</p>;

  return <h1>Admin OK</h1>;
}