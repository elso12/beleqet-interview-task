import { ConfigService } from '@nestjs/config';

/** Bull/ioredis options — supports Upstash REDIS_URL or separate env vars */
export function getRedisOptions(config: ConfigService): Record<string, unknown> {
  const base = {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    connectTimeout: 10_000,
    lazyConnect: true,
  };

  const redisUrl = config.get<string>('REDIS_URL');
  if (redisUrl) {
    const useTls = redisUrl.startsWith('rediss://') || redisUrl.includes('--tls');
    const normalized = redisUrl
      .replace(/^rediss:\/\//, 'https://')
      .replace(/^redis:\/\//, 'http://');
    const u = new URL(normalized);
    return {
      ...base,
      host: u.hostname,
      port: Number(u.port || 6379),
      password: u.password ? decodeURIComponent(u.password) : undefined,
      username: u.username && u.username !== 'default' ? u.username : undefined,
      tls: useTls ? {} : undefined,
    };
  }

  const tlsFlag = config.get<string>('REDIS_TLS', 'false');
  const useTls = tlsFlag === 'true' || tlsFlag === '1';

  return {
    ...base,
    host: config.get<string>('REDIS_HOST', 'localhost'),
    port: Number(config.get<string>('REDIS_PORT', '6379')),
    password: config.get<string>('REDIS_PASSWORD') || undefined,
    tls: useTls ? {} : undefined,
  };
}
