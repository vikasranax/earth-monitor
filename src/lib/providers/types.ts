export interface ProviderConfig {
  id: string;
  displayName: string;
  ttlSeconds: number;
  rateLimit?: {
    requests: number;
    windowSeconds: number;
  };
}

export interface ProviderResult<T> {
  data: T;
  cached: boolean;
  fetchedAt: string;
  provider: string;
}
