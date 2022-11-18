import { AxiosInstance } from 'axios';

declare module global {
  interface RateLimitedAxiosInstance extends AxiosInstance {
    getMaxRPS(): number;

    setMaxRPS(rps: number): void;

    setRateLimitOptions(options: rateLimitOptions): void;
  }

  type rateLimitOptions = { maxRequests?: number; perMilliseconds?: number; maxRPS?: number };
}
