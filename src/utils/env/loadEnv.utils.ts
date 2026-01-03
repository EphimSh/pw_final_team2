import dotenv from "dotenv";

export function loadEnv() {
  if (process.env.CI) return;
  dotenv.config({ path: ".env", override: true });
  const env = process.env.ENV ?? "local";
  dotenv.config({ path: `.env.${env}`, override: true });
}
