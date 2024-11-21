'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { toast } from 'sonner'
import { createClientSupabase } from '@/lib/supabase'

type AuthContextType = {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = React.createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClientSupabase()

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
        
        if (session?.user) {
          if (pathname === '/login' || pathname === '/signup') {
            router.replace('/dashboard')
          }
        } else if (pathname?.startsWith('/dashboard')) {
          router.replace('/login')
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      
      if (event === 'SIGNED_IN') {
        if (pathname === '/login' || pathname === '/signup') {
          router.replace('/dashboard')
        }
      } else if (event === 'SIGNED_OUT') {
        router.replace('/login')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [pathname, router])

  const signOutUser = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error)
      toast.error('Error signing out.')
    } else {
      toast.success('Signed out successfully.')
      router.replace('/login')
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut: signOutUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}