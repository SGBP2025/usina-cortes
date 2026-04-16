import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: job } = await supabase
    .from("processing_jobs")
    .select("id, status, error_message, credits_consumed, created_at, started_at, completed_at")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!job) return NextResponse.json({ error: "Job não encontrado" }, { status: 404 });

  let clips: unknown[] = [];
  if (job.status === "completed") {
    const { data } = await supabase
      .from("generated_clips")
      .select("id, storage_path, duration, tiktok_description, instagram_description, youtube_title, expires_at")
      .eq("job_id", id);
    clips = data ?? [];
  }

  return NextResponse.json({ job, clips });
}
