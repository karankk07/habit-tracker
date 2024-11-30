const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
] as const

type EnvVar = typeof requiredEnvVars[number]

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Record<EnvVar, string> {}
  }
}

export function validateEnv() {
  if (typeof window !== 'undefined') return // Skip on client-side

  const missingVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  )

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    )
  }
}

// Call this in app/layout.tsx
export function initializeEnv() {
  if (process.env.NODE_ENV === 'production') {
    validateEnv()
  }
} 