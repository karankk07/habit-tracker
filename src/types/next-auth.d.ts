import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
      // ... other user properties
    } & DefaultSession['user']
  }
} 