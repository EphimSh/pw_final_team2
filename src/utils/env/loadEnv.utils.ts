import dotenv from "dotenv";

export function loadEnv() {
  if (process.env.CI) return;
  dotenv.config({ path: ".env", override: false });
  const env = process.env.ENV ?? "local";
  dotenv.config({ path: `.env.${env}`, override: false });
}
