import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  // Verifica autenticação do usuário
  const supabase = await createServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { storagePath } = await req.json();

  if (!storagePath || !storagePath.startsWith(`${user.id}/`)) {
    return NextResponse.json({ error: "Path inválido" }, { status: 400 });
  }

  // Service role para gerar signed URL (bypassa RLS na criação da URL)
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await admin.storage
    .from("videos")
    .createSignedUploadUrl(storagePath);

  if (error || !data) {
    console.error("[signed-url] error:", JSON.stringify(error));
    return NextResponse.json({ error: error?.message ?? "Erro ao gerar URL" }, { status: 500 });
  }

  return NextResponse.json({ signedUrl: data.signedUrl, token: data.token, path: data.path });
}
