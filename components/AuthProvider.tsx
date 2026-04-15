"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      // força sync de sessão entre abas/páginas
    });

    return () => subscription.unsubscribe();
  }, []);

  return children;
}