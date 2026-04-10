import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getUserJobs, getUserCredits } from "@/lib/supabase/queries";
import { JobsTable } from "@/components/organisms/JobsTable";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [jobs, credits] = await Promise.all([
    getUserJobs(user.id),
    getUserCredits(user.id),
  ]);

  const name = (user.user_metadata?.name as string) ?? "Creator";
  const balance = Number(credits?.balance_minutes ?? 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Olá, {name.split(" ")[0]} 👋</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Você tem <span className="text-white font-medium">{balance.toFixed(0)} minutos</span> de processamento disponíveis.
          </p>
        </div>
        <Link
          href="/dashboard/upload"
          className="rounded-lg bg-brand-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-red-500 transition-colors"
        >
          + Novo vídeo
        </Link>
      </div>

      {/* Jobs recentes */}
      <div className="rounded-2xl border border-zinc-800 bg-bg-surface overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Processamentos recentes</h2>
          <Link href="/dashboard/clips" className="text-sm text-zinc-400 hover:text-white">
            Ver clipes →
          </Link>
        </div>
        <JobsTable jobs={jobs} />
      </div>
    </div>
  );
}
