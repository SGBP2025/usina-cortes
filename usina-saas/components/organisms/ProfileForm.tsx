"use client";

import { useActionState } from "react";
import { Button } from "@/components/atoms/Button";
import { FormField } from "@/components/molecules/FormField";
import { updateProfileAction, type SettingsState } from "@/app/(dashboard)/settings/actions";

interface ProfileFormProps {
  name: string;
  email: string;
}

export function ProfileForm({ name, email }: ProfileFormProps) {
  const [state, formAction, pending] = useActionState<SettingsState, FormData>(
    updateProfileAction,
    {}
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <FormField
        label="Nome"
        name="name"
        type="text"
        defaultValue={name}
        required
      />
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-zinc-300">Email</label>
        <input
          value={email}
          disabled
          className="w-full rounded-lg border border-zinc-700 bg-bg-elevated px-4 py-2.5 text-sm text-zinc-500 cursor-not-allowed"
        />
        <p className="text-xs text-zinc-600">Email não pode ser alterado.</p>
      </div>
      {state.error && (
        <p className="text-sm text-error bg-error/10 border border-error/30 rounded-lg px-4 py-2.5">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="text-sm text-success bg-success/10 border border-success/30 rounded-lg px-4 py-2.5">
          {state.success}
        </p>
      )}
      <Button type="submit" loading={pending}>Salvar alterações</Button>
    </form>
  );
}
