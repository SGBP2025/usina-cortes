import Link from "next/link";

const STATUS_STYLE: Record<string, string> = {
  pending:    "bg-zinc-700/50 text-zinc-300",
  processing: "bg-processing/10 text-processing animate-pulse",
  completed:  "bg-success/10 text-success",
  error:      "bg-error/10 text-error",
  cancelled:  "bg-zinc-700/50 text-zinc-500",
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Na fila", processing: "Processando",
  completed: "Concluído", error: "Erro", cancelled: "Cancelado",
};

interface Job {
  id: string;
  status: string;
  created_at: string;
  clips_count: number;
  credits_consumed: number | null;
}

export function JobsTable({ jobs }: { jobs: Job[] }) {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-16 space-y-3">
        <p className="text-4xl">🎬</p>
        <p className="text-white font-medium">Nenhum vídeo processado ainda</p>
        <p className="text-sm text-zinc-500">
          <Link href="/dashboard/upload" className="text-brand-primary hover:underline">
            Envie seu primeiro vídeo →
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-800">
            <th className="text-left py-3 px-4 text-zinc-400 font-medium">Data</th>
            <th className="text-left py-3 px-4 text-zinc-400 font-medium">Status</th>
            <th className="text-right py-3 px-4 text-zinc-400 font-medium">Clipes</th>
            <th className="text-right py-3 px-4 text-zinc-400 font-medium">Créditos</th>
            <th className="py-3 px-4" />
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id} className="border-b border-zinc-800/50 hover:bg-bg-elevated">
              <td className="py-3 px-4 text-zinc-300">
                {new Date(job.created_at).toLocaleDateString("pt-BR", {
                  day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
                })}
              </td>
              <td className="py-3 px-4">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[job.status] ?? STATUS_STYLE.pending}`}>
                  {STATUS_LABEL[job.status] ?? job.status}
                </span>
              </td>
              <td className="py-3 px-4 text-right text-zinc-300">{job.clips_count}</td>
              <td className="py-3 px-4 text-right text-zinc-300">
                {job.credits_consumed ? `${Number(job.credits_consumed).toFixed(1)} min` : "—"}
              </td>
              <td className="py-3 px-4 text-right">
                <Link href={`/dashboard/jobs/${job.id}`} className="text-xs text-brand-primary hover:underline">
                  Ver →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
