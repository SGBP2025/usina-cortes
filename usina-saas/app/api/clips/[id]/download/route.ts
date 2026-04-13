import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getDownloadUrl, R2_CLIPS_BUCKET } from "@/lib/r2";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Verificar que o clip pertence ao usuário (via job)
  const { data: clip } = await supabase
    .from("generated_clips")
    .select("storage_path, processing_jobs!inner(user_id)")
    .eq("id", id)
    .eq("processing_jobs.user_id", user.id)
    .single();

  if (!clip) return NextResponse.json({ error: "Clip não encontrado" }, { status: 404 });

  try {
    const url = await getDownloadUrl(R2_CLIPS_BUCKET, clip.storage_path);
    return NextResponse.json({ url });
  } catch (err) {
    console.error("[download] R2 error:", err);
    return NextResponse.json({ error: "Erro ao gerar URL de download" }, { status: 500 });
  }
}
