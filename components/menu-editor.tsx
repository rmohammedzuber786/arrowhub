'use client'

import { useState } from 'react'
import { Trash2, Plus, Pencil, X, Check } from 'lucide-react'
import type { AppData, MenuItem } from '@/lib/store'
import { formatRupees } from '@/lib/store'

const CATEGORIES = [
  'Starters',
  'Main Course',
  'Desserts',
  'Beverages',
]

function emptyItem(): MenuItem {
  return {
    id: crypto.randomUUID(),
    name: '',
    description: '',
    price: 0,
    category: 'Starters',
    available: true,
  }
}

export function MenuEditor({
  data,
  update,
}: {
  data: AppData
  update: (updater: (prev: AppData) => AppData) => void
}) {
  const [editing, setEditing] = useState<MenuItem | null>(null)
  const [isNew, setIsNew] = useState(false)

  function startAdd() {
    setEditing(emptyItem())
    setIsNew(true)
  }

  function startEdit(item: MenuItem) {
    setEditing({ ...item })
    setIsNew(false)
  }

  function save() {
    if (!editing || !editing.name.trim()) return
    update((prev) => {
      const exists = prev.menu.some((m) => m.id === editing.id)
      return {
        ...prev,
        menu: exists
          ? prev.menu.map((m) => (m.id === editing.id ? editing : m))
          : [...prev.menu, editing],
      }
    })
    setEditing(null)
  }

  function remove(id: string) {
    update((prev) => ({ ...prev, menu: prev.menu.filter((m) => m.id !== id) }))
  }

  function toggleAvailable(id: string) {
    update((prev) => ({
      ...prev,
      menu: prev.menu.map((m) =>
        m.id === id ? { ...m, available: !m.available } : m,
      ),
    }))
  }

  const grouped = CATEGORIES.map((cat) => ({
    cat,
    items: data.menu.filter((m) => m.category === cat),
  })).filter((g) => g.items.length > 0)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl text-foreground">Digital Menu</h2>
          <p className="text-sm text-muted-foreground">
            {data.menu.length} items across {grouped.length} categories
          </p>
        </div>
        <button
          onClick={startAdd}
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Add Item
        </button>
      </div>

      <div className="space-y-8">
        {grouped.map(({ cat, items }) => (
          <section key={cat}>
            <h3 className="mb-3 flex items-center gap-3 text-lg text-primary">
              <span>{cat}</span>
              <span className="h-px flex-1 bg-border" />
            </h3>
            <ul className="space-y-2">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start justify-between gap-4 rounded-lg border border-border bg-card/50 p-4"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-foreground">
                        {item.name}
                      </span>
                      {!item.available && (
                        <span className="rounded-full bg-destructive/15 px-2 py-0.5 text-xs text-destructive">
                          Unavailable
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="font-serif text-lg text-primary">
                      {formatRupees(item.price)}
                    </span>
                    <button
                      onClick={() => toggleAvailable(item.id)}
                      title="Toggle availability"
                      className="rounded-md p-1.5 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => startEdit(item)}
                      title="Edit"
                      className="rounded-md p-1.5 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => remove(item.id)}
                      title="Delete"
                      className="rounded-md p-1.5 text-muted-foreground transition hover:bg-destructive/15 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
        {data.menu.length === 0 && (
          <p className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
            No menu items yet. Click “Add Item” to get started.
          </p>
        )}
      </div>

      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setEditing(null)}
        >
          <div
            className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl text-foreground">
                {isNew ? 'Add Menu Item' : 'Edit Menu Item'}
              </h3>
              <button
                onClick={() => setEditing(null)}
                className="rounded-md p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <Field label="Name">
                <input
                  value={editing.name}
                  onChange={(e) =>
                    setEditing({ ...editing, name: e.target.value })
                  }
                  className="w-full rounded-md border border-input bg-background/70 px-3 py-2 text-foreground outline-none focus:border-primary"
                  placeholder="Dish name"
                />
              </Field>
              <Field label="Description">
                <textarea
                  value={editing.description}
                  onChange={(e) =>
                    setEditing({ ...editing, description: e.target.value })
                  }
                  rows={2}
                  className="w-full resize-none rounded-md border border-input bg-background/70 px-3 py-2 text-foreground outline-none focus:border-primary"
                  placeholder="Short description"
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Price (₹)">
                  <input
                    type="number"
                    min={0}
                    value={editing.price || ''}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        price: Math.max(0, Number(e.target.value) || 0),
                      })
                    }
                    className="w-full rounded-md border border-input bg-background/70 px-3 py-2 text-foreground outline-none focus:border-primary"
                    placeholder="0"
                  />
                </Field>
                <Field label="Category">
                  <select
                    value={editing.category}
                    onChange={(e) =>
                      setEditing({ ...editing, category: e.target.value })
                    }
                    className="w-full rounded-md border border-input bg-background/70 px-3 py-2 text-foreground outline-none focus:border-primary"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setEditing(null)}
                className="rounded-md border border-border px-4 py-2 text-sm text-foreground transition hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                onClick={save}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                Save Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-muted-foreground">{label}</span>
      {children}
    </label>
  )
}
