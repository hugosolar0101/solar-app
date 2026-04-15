"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

export default function AdminPage() {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
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

      if (profile?.role !== "admin") {
        window.location.replace("/dashboard");
        return;
      }

      setLoading(false);
    };

    checkAccess();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h1>Painel Admin</h1>
    </div>
  );
}