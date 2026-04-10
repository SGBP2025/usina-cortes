import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserCredits, getUsageHistory } from "@/lib/supabase/queries";
import { UsageTable } from "@/components/organisms/UsageTable";

export default async function CreditsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [credits, usage] = await Promise.all([
    getUserCredits(user.id),
    getUsageHistory(user.id),
  ]);

  const balance = Number(credits?.balance_minutes ?? 0);
  const isLow = balance < 10;

  return (
    <div className="space-y-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-white">Créditos</h1>

      {/* Saldo atual */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`rounded-2xl border p-6 ${isLow ? "border-warning/40 bg-warning/5" : "border-zinc-800 bg-bg-surface"}`}>
          <p className="text-sm text-zinc-400">Saldo disponível</p>
          <p className={`text-3xl font-bold mt-1 ${isLow ? "text-warning" : "text-white"}`}>
            {balance.toFixed(0)} <span className="text-lg font-normal">min</span>
          </p>
          {isLow && <p className="text-xs text-warning mt-1">⚠️ Saldo baixo</p>}
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-bg-surface p-6">
          <p className="text-sm text-zinc-400">Total consumido</p>
          <p className="text-3xl font-bold mt-1 text-white">
            {Number(credits?.total_consumed ?? 0).toFixed(0)} <span className="text-lg font-normal">min</span>
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-bg-surface p-6">
          <p className="text-sm text-zinc-400">Plano atual</p>
          <p className="text-3xl font-bold mt-1 text-white">{credits?.plan_name ?? "—"}</p>
          <p className="text-xs text-zinc-500 mt-1">{credits?.included_minutes} min inclusos</p>
        </div>
      </div>

      {/* Histórico de uso */}
      <div className="rounded-2xl border border-zinc-800 bg-bg-surface overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-800">
          <h2 className="text-lg font-semibold text-white">Histórico de uso</h2>
        </div>
        <UsageTable rows={usage} />
      </div>
    </div>
  );
}
