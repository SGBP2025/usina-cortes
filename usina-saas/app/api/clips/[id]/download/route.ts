import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Verificar que o clip pertence ao usuário (via job) — usa JWT do user para RLS
  const { data: clip } = await supabase
    .from("generated_clips")
    .select("storage_path, processing_jobs!inner(user_id)")
    .eq("id", id)
    .eq("processing_jobs.user_id", user.id)
    .single();

  if (!clip) return NextResponse.json({ error: "Clip não encontrado" }, { status: 404 });

  // Usa service role para createSignedUrl — bucket clips não tem policy pública
  const serviceClient = createServiceClient();
  const { data } = await serviceClient.storage
    .from("clips")
    .createSignedUrl(clip.storage_path, 3600);

  if (!data?.signedUrl) {
    return NextResponse.json({ error: "Erro ao gerar URL de download" }, { status: 500 });
  }

  return NextResponse.json({ url: data.signedUrl });
}
