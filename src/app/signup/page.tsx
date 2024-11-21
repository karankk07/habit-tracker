// app/signup/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { ClientOnly } from "@/components/providers/client-only"

export default function SignUpPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // First check if the username already exists in auth.users
      const { data: { user } } = await supabase.auth.signUp({
        email: `${username}@example.com`,
        password,
        options: {
          data: {
            username, // Store username in user metadata
          },
        },
      })

      if (!user) {
        throw new Error('Failed to create account')
      }

      // Create a profile entry for the user
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: user.id,
            username,
            created_at: new Date().toISOString(),
          }
        ])

      if (profileError) throw profileError

      router.push("/dashboard")
    } catch (error) {
      console.error('Signup error:', error)
      setError(error instanceof Error ? error.message : "An error occurred during signup")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ClientOnly>
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>Create a new account to start tracking your habits</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  required
                  minLength={3}
                  pattern="[a-zA-Z0-9]+"
                  title="Username can only contain letters and numbers"
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating account..." : "Sign Up"}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Login
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </ClientOnly>
  )
}