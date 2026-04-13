import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { getUploadUrl, R2_VIDEOS_BUCKET } from "@/lib/r2";

export async function POST(req: NextRequest) {
  const supabase = await createServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { storagePath } = await req.json();
  if (!storagePath || !storagePath.startsWith(`${user.id}/`)) {
    return NextResponse.json({ error: "Path inválido" }, { status: 400 });
  }

  try {
    const uploadUrl = await getUploadUrl(R2_VIDEOS_BUCKET, storagePath);
    return NextResponse.json({ uploadUrl });
  } catch (err) {
    console.error("[signed-url] R2 error:", err);
    return NextResponse.json({ error: "Erro ao gerar URL de upload" }, { status: 500 });
  }
}
