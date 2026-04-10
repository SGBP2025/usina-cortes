import Link from "next/link";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CreditsWidget } from "@/components/molecules/CreditsWidget";
import { logoutAction } from "@/app/(auth)/logout/actions";

const NAV_LINKS = [
  { href: "/dashboard", label: "Início" },
  { href: "/dashboard/upload", label: "Upload" },
  { href: "/dashboard/clips", label: "Clipes" },
  { href: "/dashboard/credits", label: "Créditos" },
  { href: "/dashboard/settings", label: "Configurações" },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-bg-base flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-bg-surface">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-brand-primary font-bold text-lg">
              ✂️ Usina
            </Link>
            <nav className="hidden sm:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-1.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-bg-elevated transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Suspense fallback={<div className="h-7 w-20 rounded-lg bg-bg-elevated animate-pulse" />}>
              <CreditsWidget />
            </Suspense>
            <form action={logoutAction}>
              <button
                type="submit"
                className="text-sm text-zinc-500 hover:text-white transition-colors"
              >
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {children}
      </main>
    </div>
  );
}
