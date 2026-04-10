import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { JobStatusView } from "@/components/organisms/JobStatusView";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function JobPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: job } = await supabase
    .from("processing_jobs")
    .select("id, status, error_message")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!job) notFound();

  let clips: unknown[] = [];
  if (job.status === "completed") {
    const { data } = await supabase
      .from("generated_clips")
      .select("id, storage_path, duration, tiktok_description, instagram_description, youtube_title")
      .eq("job_id", id);
    clips = data ?? [];
  }

  return (
    <JobStatusView
      jobId={id}
      initialStatus={job.status}
      initialClips={clips as Parameters<typeof JobStatusView>[0]["initialClips"]}
    />
  );
}
