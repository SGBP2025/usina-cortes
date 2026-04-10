"use client";

import { useActionState } from "react";
import { Button } from "@/components/atoms/Button";
import { FormField } from "@/components/molecules/FormField";
import { updatePasswordAction, type SettingsState } from "@/app/(dashboard)/settings/actions";

export function PasswordForm() {
  const [state, formAction, pending] = useActionState<SettingsState, FormData>(
    updatePasswordAction,
    {}
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <FormField label="Nova senha" name="newPassword" type="password" placeholder="Mínimo 8 caracteres" required />
      <FormField label="Confirmar nova senha" name="confirmPassword" type="password" placeholder="Repita a nova senha" required />
      {state.error && (
        <p className="text-sm text-error bg-error/10 border border-error/30 rounded-lg px-4 py-2.5">{state.error}</p>
      )}
      {state.success && (
        <p className="text-sm text-success bg-success/10 border border-success/30 rounded-lg px-4 py-2.5">{state.success}</p>
      )}
      <Button type="submit" loading={pending}>Alterar senha</Button>
    </form>
  );
}
