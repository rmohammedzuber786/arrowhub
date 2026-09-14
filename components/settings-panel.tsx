'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Plus, Trash2, Upload } from 'lucide-react'
import type { AppData, RestaurantTable } from '@/lib/store'

export function SettingsPanel({
  data,
  update,
}: {
  data: AppData
  update: (updater: (prev: AppData) => AppData) => void
}) {
  const [newTableName, setNewTableName] = useState('')
  const [newTableSeats, setNewTableSeats] = useState(2)

  function setSettings(patch: Partial<AppData['settings']>) {
    update((prev) => ({ ...prev, settings: { ...prev.settings, ...patch } }))
  }

  function addTable() {
    const name = newTableName.trim()
    if (!name) return
    const table: RestaurantTable = {
      id: crypto.randomUUID(),
      name,
      seats: Math.max(1, newTableSeats),
    }
    update((prev) => ({ ...prev, tables: [...prev.tables, table] }))
    setNewTableName('')
    setNewTableSeats(2)
  }

  function updateTable(id: string, patch: Partial<RestaurantTable>) {
    update((prev) => ({
      ...prev,
      tables: prev.tables.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }))
  }

  function removeTable(id: string) {
    update((prev) => ({ ...prev, tables: prev.tables.filter((t) => t.id !== id) }))
  }

  function onLogoFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setSettings({ logo: String(reader.result) })
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl text-foreground">Settings</h2>
        <p className="text-sm text-muted-foreground">
          Manage your brand, logo, and tables.
        </p>
      </div>

      {/* Brand & logo */}
      <section className="rounded-xl border border-border bg-card/50 p-5">
        <h3 className="mb-4 text-lg text-primary">Brand & Logo</h3>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-lg border border-border bg-background/60">
              <Image
                src={data.settings.logo || '/arrow-hub-logo.png'}
                alt="Restaurant logo"
                width={128}
                height={128}
                className="h-full w-full object-contain"
              />
            </div>
            <label className="flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm text-foreground transition hover:bg-secondary">
              <Upload className="h-4 w-4" />
              Upload logo
              <input
                type="file"
                accept="image/*"
                onChange={onLogoFile}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex-1 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm text-muted-foreground">
                Restaurant name
              </span>
              <input
                value={data.settings.restaurantName}
                onChange={(e) => setSettings({ restaurantName: e.target.value })}
                className="w-full rounded-md border border-input bg-background/70 px-3 py-2 text-foreground outline-none focus:border-primary"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm text-muted-foreground">
                Tagline
              </span>
              <input
                value={data.settings.tagline}
                onChange={(e) => setSettings({ tagline: e.target.value })}
                className="w-full rounded-md border border-input bg-background/70 px-3 py-2 text-foreground outline-none focus:border-primary"
              />
            </label>
          </div>
        </div>
      </section>

      {/* Tables */}
      <section className="rounded-xl border border-border bg-card/50 p-5">
        <h3 className="mb-4 text-lg text-primary">Tables</h3>
        <ul className="mb-4 space-y-2">
          {data.tables.map((t) => (
            <li
              key={t.id}
              className="flex items-center gap-3 rounded-lg border border-border bg-background/40 p-3"
            >
              <input
                value={t.name}
                onChange={(e) => updateTable(t.id, { name: e.target.value })}
                className="flex-1 rounded-md border border-input bg-background/70 px-3 py-1.5 text-foreground outline-none focus:border-primary"
              />
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Seats</span>
                <input
                  type="number"
                  min={1}
                  value={t.seats}
                  onChange={(e) =>
                    updateTable(t.id, {
                      seats: Math.max(1, Number(e.target.value) || 1),
                    })
                  }
                  className="w-16 rounded-md border border-input bg-background/70 px-2 py-1.5 text-center text-foreground outline-none focus:border-primary"
                />
              </div>
              <button
                onClick={() => removeTable(t.id)}
                className="rounded-md p-1.5 text-muted-foreground transition hover:bg-destructive/15 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
          {data.tables.length === 0 && (
            <li className="text-sm text-muted-foreground">No tables yet.</li>
          )}
        </ul>

        <div className="flex flex-wrap items-end gap-3 border-t border-border pt-4">
          <label className="flex-1">
            <span className="mb-1.5 block text-sm text-muted-foreground">
              New table name
            </span>
            <input
              value={newTableName}
              onChange={(e) => setNewTableName(e.target.value)}
              placeholder="e.g. Table 6"
              className="w-full rounded-md border border-input bg-background/70 px-3 py-2 text-foreground outline-none focus:border-primary"
            />
          </label>
          <label>
            <span className="mb-1.5 block text-sm text-muted-foreground">
              Seats
            </span>
            <input
              type="number"
              min={1}
              value={newTableSeats}
              onChange={(e) => setNewTableSeats(Number(e.target.value) || 1)}
              className="w-20 rounded-md border border-input bg-background/70 px-3 py-2 text-center text-foreground outline-none focus:border-primary"
            />
          </label>
          <button
            onClick={addTable}
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> Add Table
          </button>
        </div>
      </section>
    </div>
  )
}
