'use client'

import type React from 'react'
import { useState } from 'react'
import Image from 'next/image'
import { Eye, EyeOff } from 'lucide-react'

export function LoginScreen({
  onLogin,
}: {
  onLogin: (username: string, password: string) => boolean
}) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [showHint, setShowHint] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const ok = onLogin(username, password)
    if (!ok) setError('Invalid username or password.')
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image
            src="/arrow-hub-logo.png"
            alt="Arrow Hub logo"
            width={140}
            height={140}
            className="h-32 w-auto object-contain"
            priority
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-border bg-card/60 p-8 shadow-2xl backdrop-blur"
        >
          <p className="mb-1 text-center text-xs uppercase tracking-[0.35em] text-primary">
            Staff Access
          </p>
          <h1 className="mb-6 text-center text-2xl text-foreground">
            Sign in to continue
          </h1>

          <label className="mb-4 block">
            <span className="mb-1.5 block text-sm text-muted-foreground">
              Username
            </span>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                setError('')
              }}
              autoComplete="username"
              className="w-full rounded-md border border-input bg-background/70 px-3 py-2.5 text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="admin"
            />
          </label>

          <label className="mb-6 block">
            <span className="mb-1.5 block text-sm text-muted-foreground">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
              autoComplete="current-password"
              className="w-full rounded-md border border-input bg-background/70 px-3 py-2.5 text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="••••••••"
            />
          </label>

          {error ? (
            <p className="mb-4 text-center text-sm text-destructive">{error}</p>
          ) : null}

          <button
            type="submit"
            className="w-full rounded-md bg-primary py-2.5 font-medium text-primary-foreground transition hover:opacity-90"
          >
            Sign In
          </button>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Demo credentials — user{' '}
            <span className="text-primary">admin</span> / pass{' '}
            <span className="text-primary">arrowhub</span>
          </p>
        </form>
      </div>
    </main>
  )
}
