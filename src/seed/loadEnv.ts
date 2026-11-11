import dotenv from 'dotenv'

/** Load `.env.local` (Neon) then `.env` before importing payload.config. */
export function loadSeedEnv() {
  dotenv.config({ path: '.env.local' })
  dotenv.config()
}
