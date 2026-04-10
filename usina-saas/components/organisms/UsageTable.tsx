interface UsageRow {
  id: string;
  service: string;
  cost_usd: number | null;
  duration_seconds: number | null;
  created_at: string;
}

interface UsageTableProps {
  rows: UsageRow[];
}

export function UsageTable({ rows }: UsageTableProps) {
  if (rows.length === 0) {
    return (
      <p className="text-center text-sm text-zinc-500 py-8">
        Nenhum uso registrado ainda.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-800">
            <th className="text-left py-3 px-4 text-zinc-400 font-medium">Data</th>
            <th className="text-left py-3 px-4 text-zinc-400 font-medium">Serviço</th>
            <th className="text-right py-3 px-4 text-zinc-400 font-medium">Duração</th>
            <th className="text-right py-3 px-4 text-zinc-400 font-medium">Custo</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-zinc-800/50 hover:bg-bg-elevated">
              <td className="py-3 px-4 text-zinc-300">
                {new Date(row.created_at).toLocaleDateString("pt-BR")}
              </td>
              <td className="py-3 px-4">
                <span className="rounded-full bg-processing/10 text-processing px-2 py-0.5 text-xs font-medium capitalize">
                  {row.service}
                </span>
              </td>
              <td className="py-3 px-4 text-right text-zinc-300">
                {row.duration_seconds ? `${(row.duration_seconds / 60).toFixed(1)} min` : "—"}
              </td>
              <td className="py-3 px-4 text-right text-zinc-300">
                {row.cost_usd ? `$${Number(row.cost_usd).toFixed(4)}` : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
