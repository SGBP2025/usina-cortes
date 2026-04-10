import { getUserCredits } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export async function CreditsWidget() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const credits = await getUserCredits(user.id);
  if (!credits) return null;

  const balance = Number(credits.balance_minutes);
  const isLow = balance < 10;

  return (
    <Link
      href="/dashboard/credits"
      className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
        isLow
          ? "bg-warning/10 border border-warning/30 text-warning hover:bg-warning/20"
          : "bg-bg-elevated border border-zinc-700 text-zinc-300 hover:border-zinc-500"
      }`}
    >
      <span>⏱</span>
      <span>{balance.toFixed(0)} min</span>
      {isLow && <span className="text-xs">⚠️</span>}
    </Link>
  );
}
