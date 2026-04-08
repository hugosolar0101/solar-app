import { supabase } from "@/lib/supabaseClient"

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser()
  return data.user
}

export async function getUserRole() {
  const { data: userData } = await supabase.auth.getUser()

  if (!userData.user) return null

  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .single()

  return data?.role || null
}