'use client'

import { useAuth } from '@/lib/auth'
import { useAppData } from '@/lib/store'
import { LoginScreen } from '@/components/login-screen'
import { Dashboard } from '@/components/dashboard'

export default function Page() {
  const { authed, loaded: authLoaded, login, logout } = useAuth()
  const { data, update, loaded: dataLoaded } = useAppData()

  if (!authLoaded || !dataLoaded) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </main>
    )
  }

  if (!authed) {
    return <LoginScreen onLogin={login} />
  }

  return <Dashboard data={data} update={update} onLogout={logout} />
}
