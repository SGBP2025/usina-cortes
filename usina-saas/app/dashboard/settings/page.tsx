import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/organisms/ProfileForm";
import { PasswordForm } from "@/components/organisms/PasswordForm";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const name = (user.user_metadata?.name as string) ?? "";

  return (
    <div className="max-w-lg space-y-8">
      <h1 className="text-2xl font-bold text-white">Configurações</h1>

      <section className="rounded-2xl border border-zinc-800 bg-bg-surface p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">Perfil</h2>
        <ProfileForm name={name} email={user.email ?? ""} />
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-bg-surface p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">Alterar senha</h2>
        <PasswordForm />
      </section>
    </div>
  );
}
