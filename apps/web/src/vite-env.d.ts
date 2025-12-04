/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MODE: 'development' | 'production' | 'test'
  readonly PROD: boolean
  readonly DEV: boolean
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
  readonly VITE_SENTRY_DSN?: string
  readonly VITE_GA_MEASUREMENT_ID?: string
  readonly VITE_PLAUSIBLE_DOMAIN?: string
  readonly VITE_ERROR_TRACKING_ENABLED?: string
  readonly VITE_ERROR_TRACKING_ENDPOINT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

