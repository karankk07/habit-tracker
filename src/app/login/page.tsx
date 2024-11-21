// src/app/login/page.tsx
"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClientSupabase } from '@/lib/supabase'
import Link from "next/link"
import { toast } from 'sonner'

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const supabase = createClientSupabase()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log('Attempting login...')
      const { data, error } = await supabase.auth.signInWithPassword({
        email: `${username.toLowerCase()}@example.com`,
        password,
      })

      if (error) {
        console.error('Login error:', error)
        toast.error(error.message === 'Invalid login credentials' 
          ? 'Invalid username or password'
          : 'An error occurred during login'
        )
        return
      }

      if (data.session?.user) {
        console.log('Login successful, user:', data.session.user.id)
        toast.success('Login successful!')
        // AuthProvider handles the redirect
      }
    } catch (error) {
      console.error('Unexpected login error:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Welcome back! Please login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || !username || !password}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}