import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserCredits, getUsageHistory } from "@/lib/supabase/queries";
import { UsageTable } from "@/components/organisms/UsageTable";
import { CreditPacks } from "@/components/organisms/CreditPacks";

export default async function CreditsPage({
  searchParams,
}: {
  searchParams: Promise<{ payment?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [credits, usage, params] = await Promise.all([
    getUserCredits(user.id),
    getUsageHistory(user.id),
    searchParams,
  ]);

  const balance = Number(credits?.balance_minutes ?? 0);
  const isLow = balance < 10;
  const paymentStatus = params.payment;
  const isFreeTier = Number(credits?.total_purchased ?? 0) <= 30;

  return (
    <div className="space-y-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-white">Créditos</h1>

      {paymentStatus === "success" && (
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-5 py-4 text-green-400 text-sm font-medium">
          Pagamento aprovado! Seus créditos foram adicionados.
        </div>
      )}
      {paymentStatus === "failure" && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-400 text-sm font-medium">
          Pagamento não aprovado. Tente novamente.
        </div>
      )}
      {paymentStatus === "pending" && (
        <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-5 py-4 text-yellow-400 text-sm font-medium">
          Pagamento em análise. Você será notificado quando for aprovado.
        </div>
      )}

      {/* Banner free tier */}
      {isFreeTier && (
        <div className="rounded-xl border border-brand-primary/30 bg-brand-primary/10 px-5 py-4 flex items-center gap-3">
          <span className="text-2xl">🎁</span>
          <p className="text-sm text-zinc-200">
            Você está no <span className="text-white font-semibold">plano gratuito</span> com 30 minutos inclusos no cadastro.
            Compre um pacote para processar mais vídeos.
          </p>
        </div>
      )}

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

      {/* Comprar minutos */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Comprar minutos</h2>
        <CreditPacks />
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
