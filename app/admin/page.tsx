"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

export default function AdminPage() {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkUser = async () => {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      // 🔥 retry leve para evitar "null momentâneo"
      if (!user) {
        setTimeout(async () => {
          const {
            data: { user: retryUser },
          } = await supabase.auth.getUser();

          if (!retryUser && mounted) {
            window.location.replace("/login");
          }

          if (retryUser && mounted) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("role")
              .eq("id", retryUser.id)
              .single();

            if (profile?.role !== "admin") {
              window.location.replace("/dashboard");
              return;
            }

            setAuthorized(true);
            setLoading(false);
          }
        }, 300);

        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role !== "admin") {
        window.location.replace("/dashboard");
        return;
      }

      if (mounted) {
        setAuthorized(true);
        setLoading(false);
      }
    };

    checkUser();

    return () => {
      mounted = false;
    };
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