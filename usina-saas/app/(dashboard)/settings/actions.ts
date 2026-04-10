"use server";

import { createClient } from "@/lib/supabase/server";

export interface SettingsState {
  error?: string;
  success?: string;
}

export async function updateProfileAction(
  _prev: SettingsState,
  formData: FormData
): Promise<SettingsState> {
  const name = (formData.get("name") as string)?.trim();
  if (!name) return { error: "Nome não pode ser vazio." };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ data: { name } });

  if (error) return { error: "Erro ao atualizar perfil. Tente novamente." };
  return { success: "Perfil atualizado com sucesso." };
}

export async function updatePasswordAction(
  _prev: SettingsState,
  formData: FormData
): Promise<SettingsState> {
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!newPassword || !confirmPassword) return { error: "Preencha todos os campos." };
  if (newPassword.length < 8) return { error: "Nova senha deve ter mínimo 8 caracteres." };
  if (newPassword !== confirmPassword) return { error: "Senhas não coincidem." };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) return { error: "Erro ao alterar senha. Tente novamente." };
  return { success: "Senha alterada com sucesso." };
}
