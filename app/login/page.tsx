"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [isRegister, setIsRegister] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔐 LOGIN
  const handleLogin = async () => {
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      alert(error.message);
      return;
    }

    const user = data.user;

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user?.id)
      .single();

    setLoading(false);

    if (profile?.role === "admin") {
      router.replace("/admin");
    } else {
      router.replace("/dashboard");
    }
  };

  // 🆕 CADASTRO
  const handleRegister = async () => {
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      alert(error.message);
      return;
    }

    const user = data.user;

    if (!user) {
      setLoading(false);
      alert("Erro ao criar usuário");
      return;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .insert([
        {
          id: user.id,
          role: "user",
        },
      ]);

    if (profileError) {
      console.error(profileError);
      alert("Erro ao criar perfil");
      setLoading(false);
      return;
    }

    setLoading(false);

    alert("Conta criada com sucesso!");
    router.replace("/dashboard");
  };

  // 🔑 RECUPERAR SENHA
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
      alert("Email de recuperação enviado!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">
        {isRegister ? "Criar Conta" : "Login"}
      </h1>

      <input
        className="border p-2"
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border p-2"
        type="password"
        placeholder="Senha"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="bg-blue-500 text-white px-4 py-2"
        onClick={isRegister ? handleRegister : handleLogin}
        disabled={loading}
      >
        {loading
          ? "Carregando..."
          : isRegister
          ? "Criar conta"
          : "Entrar"}
      </button>

      {/* 🔁 alternar login/cadastro */}
      <button
        className="text-sm text-blue-600 underline"
        onClick={() => setIsRegister(!isRegister)}
      >
        {isRegister
          ? "Já tem conta? Fazer login"
          : "Não tem conta? Criar agora"}
      </button>

      {/* 🔑 recuperar senha (SÓ no modo login) */}
      {!isRegister && (
        <button
          className="text-sm text-blue-600 underline"
          onClick={handleResetPassword}
        >
          Esqueci minha senha
        </button>
      )}
    </div>
  );
}