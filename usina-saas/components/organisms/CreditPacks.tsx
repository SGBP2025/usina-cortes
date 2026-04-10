"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CREDIT_PACKS } from "@/lib/billing/packs";

export function CreditPacks() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleBuy(packId: string) {
    setLoading(packId);
    try {
      const res = await fetch("/api/billing/create-preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pack_id: packId }),
      });
      const data = await res.json();
      if (data.init_point) {
        router.push(data.init_point);
      }
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {CREDIT_PACKS.map((pack) => (
        <div
          key={pack.id}
          className={`rounded-2xl border p-6 flex flex-col gap-4 ${
            pack.highlight
              ? "border-brand/60 bg-brand/5 ring-1 ring-brand/30"
              : "border-zinc-800 bg-bg-surface"
          }`}
        >
          {pack.highlight && (
            <span className="text-xs font-semibold text-brand uppercase tracking-wider">
              Mais popular
            </span>
          )}
          <div>
            <p className="text-lg font-semibold text-white">{pack.label}</p>
            <p className="text-3xl font-bold text-white mt-1">
              {pack.minutes}{" "}
              <span className="text-lg font-normal text-zinc-400">min</span>
            </p>
          </div>
          <p className="text-2xl font-bold text-white">
            R${" "}
            {pack.price_brl.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </p>
          <button
            onClick={() => handleBuy(pack.id)}
            disabled={loading === pack.id}
            className={`mt-auto w-full rounded-xl py-2.5 text-sm font-semibold transition-colors ${
              pack.highlight
                ? "bg-brand text-black hover:bg-brand/90 disabled:opacity-60"
                : "bg-zinc-800 text-white hover:bg-zinc-700 disabled:opacity-60"
            }`}
          >
            {loading === pack.id ? "Aguarde..." : "Comprar"}
          </button>
        </div>
      ))}
    </div>
  );
}
