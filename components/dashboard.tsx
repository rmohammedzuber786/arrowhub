'use client'

import { useState } from 'react'
import Image from 'next/image'
import { UtensilsCrossed, Calculator, Settings, LogOut } from 'lucide-react'
import type { AppData } from '@/lib/store'
import { MenuEditor } from '@/components/menu-editor'
import { BillingCalculator } from '@/components/billing-calculator'
import { SettingsPanel } from '@/components/settings-panel'

type Tab = 'menu' | 'billing' | 'settings'

const TABS: { id: Tab; label: string; icon: typeof UtensilsCrossed }[] = [
  { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
  { id: 'billing', label: 'Billing', icon: Calculator },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export function Dashboard({
  data,
  update,
  onLogout,
}: {
  data: AppData
  update: (updater: (prev: AppData) => AppData) => void
  onLogout: () => void
}) {
  const [tab, setTab] = useState<Tab>('menu')

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <Image
              src={data.settings.logo || '/arrow-hub-logo.png'}
              alt={`${data.settings.restaurantName} logo`}
              width={44}
              height={44}
              className="h-11 w-11 object-contain"
            />
            <div>
              <p className="font-serif text-lg leading-tight text-foreground">
                {data.settings.restaurantName}
              </p>
              <p className="text-xs uppercase tracking-[0.25em] text-primary">
                {data.settings.tagline}
              </p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm text-foreground transition hover:bg-secondary"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>

        <nav className="mx-auto flex max-w-6xl gap-1 px-4">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm transition ${
                tab === id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {tab === 'menu' && <MenuEditor data={data} update={update} />}
        {tab === 'billing' && <BillingCalculator data={data} />}
        {tab === 'settings' && <SettingsPanel data={data} update={update} />}
      </main>
    </div>
  )
}
