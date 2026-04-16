"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

type User = {
  id: string;
  email: string;
};

export default function AdminPage() {
  const supabase = createClient();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [passwords, setPasswords] = useState<Record<string, string>>({});

  // 🔥 carregar usuários via API
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await fetch("/api/admin/list-users");
        const data = await res.json();

        if (!res.ok) {
          console.error(data.error);
          alert(data.error);
          setLoading(false);
          return;
        }

        setUsers(
          data.users.map((u: any) => ({
            id: u.id,
            email: u.email,
          }))
        );
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    };

    loadUsers();
  }, []);

  // 🔐 reset senha
  const resetPassword = async (userId: string) => {
    const newPassword = passwords[userId];

    if (!newPassword) {
      alert("Digite a nova senha");
      return;
    }

    const res = await fetch("/api/admin/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        newPassword,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    alert("Senha atualizada com sucesso!");
  };

  // 🚪 LOGOUT
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  if (loading) return <p>Carregando usuários...</p>;

  return (
    <div className="p-6">
      {/* 🔥 HEADER COM LOGOUT */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin - Usuários</h1>

        <button
          onClick={handleLogout}
          className="bg-gray-800 text-white px-4 py-2 rounded"
        >
          Sair
        </button>
      </div>

      <div className="space-y-4">
        {users.length === 0 && (
          <p>Nenhum usuário cadastrado</p>
        )}

        {users.map((user) => (
          <div
            key={user.id}
            className="border p-4 rounded flex flex-col gap-2"
          >
            <p className="font-semibold">{user.email}</p>

            <input
              type="text"
              placeholder="Nova senha"
              className="border p-2"
              onChange={(e) =>
                setPasswords({
                  ...passwords,
                  [user.id]: e.target.value,
                })
              }
            />

            <button
              className="bg-red-500 text-white px-3 py-1 rounded"
              onClick={() => resetPassword(user.id)}
            >
              Resetar senha
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}