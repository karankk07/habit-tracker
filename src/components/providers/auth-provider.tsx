'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import type { User, AuthError, Session } from '@supabase/supabase-js'
import { toast } from 'sonner'
import { createClientSupabase } from '@/lib/supabase'

interface AuthState {
  user: User | null
  loading: boolean
  error: AuthError | null
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{
    data: { user: User | null; session: Session | null } | null;
    error: AuthError | null;
  }>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  })
  const router = useRouter()
  const supabase = createClientSupabase()
  const pathname = usePathname()

  const refreshSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      setState(prev => ({
        ...prev,
        user: session?.user ?? null,
        loading: false,
        error: null,
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        user: null,
        loading: false,
        error: error as AuthError,
      }))
    }
  }

  useEffect(() => {
    refreshSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setState(prev => ({
          ...prev,
          user: session?.user ?? null,
          loading: false,
          error: null,
        }))

        const isAuthRoute = pathname === '/login' || pathname === '/signup'
        if (event === 'SIGNED_IN' && isAuthRoute) {
          router.push('/dashboard')
        }
        if (event === 'SIGNED_OUT' && !isAuthRoute) {
          router.push('/login')
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router, pathname])

  const signIn = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          toast.error('Please verify your email before logging in.');
        } else {
          toast.error(error.message || 'Failed to sign in');
        }
        setState(prev => ({ ...prev, error: error as AuthError }));
        return { data: null, error };
      }

      // If login successful
      if (data.user) {
        toast.success('Successfully logged in!');
        router.push('/dashboard');
      }

      return { data, error: null };
    } catch (error) {
      setState(prev => ({ ...prev, error: error as AuthError }));
      return { data: null, error: error as AuthError };
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      
      if (error) throw error

      // If we get here, signup was successful
      toast.success('Verification email sent! Please check your inbox.')
      router.push("/login?message=verification-email-sent")
    } catch (error) {
      setState(prev => ({ ...prev, error: error as AuthError }))
      toast.error(error instanceof Error ? error.message : 'Failed to sign up')
      throw error
    } finally {
      setState(prev => ({ ...prev, loading: false }))
    }
  }

  const signOut = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      setState(prev => ({ ...prev, error: error as AuthError }))
      toast.error(error instanceof Error ? error.message : 'Failed to sign out')
      throw error
    } finally {
      setState(prev => ({ ...prev, loading: false }))
    }
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signUp,
        signOut,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}