import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Rate limit: 5 jobs/hora por usuário
// Usa Redis local em dev, Upstash em produção
let ratelimit: Ratelimit | null = null;

export function getRateLimiter() {
  if (!ratelimit) {
    const redisUrl = process.env.REDIS_URL;

    // Upstash Redis (produção) requer UPSTASH_REDIS_REST_URL e UPSTASH_REDIS_REST_TOKEN
    // Para dev local com Redis padrão, o rate limiting é desabilitado (sem REST API)
    const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
    const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!upstashUrl || !upstashToken) {
      return null; // Dev local sem Upstash — rate limit desabilitado
    }

    ratelimit = new Ratelimit({
      redis: new Redis({ url: upstashUrl, token: upstashToken }),
      limiter: Ratelimit.slidingWindow(5, "1 h"),
      analytics: false,
      prefix: "usina:rl",
    });
  }
  return ratelimit;
}
