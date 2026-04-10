import Bull from "bull";

interface VideoJobData {
  jobId: string;
  userId: string;
  videoFileId: string;
  storagePath: string;
}

let queue: Bull.Queue<VideoJobData> | null = null;

function getQueue(): Bull.Queue<VideoJobData> {
  if (!queue) {
    queue = new Bull<VideoJobData>("video-jobs", {
      redis: process.env.REDIS_URL || "redis://localhost:6379",
    });
  }
  return queue;
}

export async function enqueueVideoJob(
  jobId: string,
  userId: string,
  videoFileId: string,
  storagePath: string
): Promise<void> {
  const q = getQueue();
  await q.add({ jobId, userId, videoFileId, storagePath }, {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
  });
}
