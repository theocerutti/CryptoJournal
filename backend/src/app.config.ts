export interface EnvironmentConfig {
  PORT: number;
  POSTGRES_PORT: number;
  POSTGRES_HOST: string;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_DATABASE: string;
  JWT_SECRET_KEY: string;
}
