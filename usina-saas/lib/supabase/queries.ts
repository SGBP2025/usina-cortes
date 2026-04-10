import { createClient } from "@/lib/supabase/server";

export interface UserCredits {
  balance_minutes: number;
  total_purchased: number;
  total_consumed: number;
  plan_id: string;
  plan_name: string;
  included_minutes: number;
  concurrent_jobs: number;
}

export interface JobSummary {
  id: string;
  status: string;
  created_at: string;
  clips_count: number;
  credits_consumed: number | null;
}

export interface ClipSummary {
  id: string;
  job_id: string;
  storage_path: string;
  duration: number | null;
  tiktok_description: string | null;
  instagram_description: string | null;
  youtube_title: string | null;
  created_at: string;
}

export async function getUserCredits(userId: string): Promise<UserCredits | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_user_credits", { p_user_id: userId });
  if (error || !data || data.length === 0) return null;
  return data[0] as UserCredits;
}

export async function getUsageHistory(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("usage_metrics")
    .select("id, service, cost_usd, duration_seconds, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);
  return data ?? [];
}

export async function getUserJobs(userId: string): Promise<JobSummary[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("processing_jobs")
    .select("id, status, created_at, credits_consumed")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (!data) return [];

  // Buscar contagem de clips por job
  const jobsWithClips = await Promise.all(
    data.map(async (job) => {
      const { count } = await supabase
        .from("generated_clips")
        .select("*", { count: "exact", head: true })
        .eq("job_id", job.id);
      return { ...job, clips_count: count ?? 0 };
    })
  );

  return jobsWithClips;
}

export async function getUserClips(userId: string): Promise<ClipSummary[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("generated_clips")
    .select(`
      id, job_id, storage_path, duration,
      tiktok_description, instagram_description, youtube_title, created_at,
      processing_jobs!inner(user_id)
    `)
    .eq("processing_jobs.user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  return (data ?? []) as ClipSummary[];
}
