"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

export default function AdminPage() {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      // 🔥 buscar role
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role !== "admin") {
        window.location.href = "/dashboard";
        return;
      }

      setAuthorized(true);
      setLoading(false);
    };

    checkUser();
  }, []);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (!authorized) {
    return null;
  }

  return (
    <div>
      <h1>Painel Admin</h1>
    </div>
  );
}