import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CreditPacks } from "@/components/organisms/CreditPacks";

interface Invoice {
  id: string;
  amount_brl: number;
  minutes_purchased: number | null;
  pack_id: string | null;
  status: string;
  created_at: string;
  mp_payment_id: string | null;
}

async function getUserInvoices(userId: string): Promise<Invoice[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("invoices")
    .select("id, amount_brl, minutes_purchased, pack_id, status, created_at, mp_payment_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);
  return (data ?? []) as Invoice[];
}

const STATUS_LABEL: Record<string, { label: string; className: string }> = {
  paid: { label: "Aprovado", className: "bg-green-500/10 text-green-400" },
  pending: { label: "Pendente", className: "bg-yellow-500/10 text-yellow-400" },
  cancelled: { label: "Cancelado", className: "bg-zinc-700/50 text-zinc-400" },
  failed: { label: "Falhou", className: "bg-red-500/10 text-red-400" },
};

export default async function BillingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const invoices = await getUserInvoices(user.id);

  return (
    <div className="space-y-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-white">Faturamento</h1>

      {/* Comprar minutos */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Comprar minutos</h2>
        <CreditPacks />
      </div>

      {/* Histórico de faturas */}
      <div className="rounded-2xl border border-zinc-800 bg-bg-surface overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-800">
          <h2 className="text-lg font-semibold text-white">Histórico de compras</h2>
        </div>

        {invoices.length === 0 ? (
          <p className="text-center text-sm text-zinc-500 py-8">
            Nenhuma compra realizada ainda.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-3 px-4 text-zinc-400 font-medium">Data</th>
                  <th className="text-left py-3 px-4 text-zinc-400 font-medium">Pacote</th>
                  <th className="text-right py-3 px-4 text-zinc-400 font-medium">Minutos</th>
                  <th className="text-right py-3 px-4 text-zinc-400 font-medium">Valor</th>
                  <th className="text-right py-3 px-4 text-zinc-400 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => {
                  const st = STATUS_LABEL[inv.status] ?? { label: inv.status, className: "text-zinc-400" };
                  return (
                    <tr key={inv.id} className="border-b border-zinc-800/50 hover:bg-bg-elevated">
                      <td className="py-3 px-4 text-zinc-300">
                        {new Date(inv.created_at).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="py-3 px-4 text-zinc-300 capitalize">
                        {inv.pack_id?.replace("pack_", "") ?? "—"}
                      </td>
                      <td className="py-3 px-4 text-right text-zinc-300">
                        {inv.minutes_purchased ? `${inv.minutes_purchased} min` : "—"}
                      </td>
                      <td className="py-3 px-4 text-right text-zinc-300">
                        R$ {Number(inv.amount_brl).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${st.className}`}>
                          {st.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
