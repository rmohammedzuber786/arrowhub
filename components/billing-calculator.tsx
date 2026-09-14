'use client'

import { useMemo, useState } from 'react'
import { Plus, Minus, Trash2, Receipt } from 'lucide-react'
import type { AppData } from '@/lib/store'
import { formatRupees } from '@/lib/store'

type OrderLine = { itemId: string; qty: number }

export function BillingCalculator({ data }: { data: AppData }) {
  const [tableId, setTableId] = useState(data.tables[0]?.id ?? '')
  const [order, setOrder] = useState<Record<string, number>>({})
  const [discount, setDiscount] = useState(0)

  const availableItems = useMemo(
    () => data.menu.filter((m) => m.available),
    [data.menu],
  )

  function addItem(itemId: string) {
    setOrder((prev) => ({ ...prev, [itemId]: (prev[itemId] ?? 0) + 1 }))
  }

  function changeQty(itemId: string, delta: number) {
    setOrder((prev) => {
      const next = { ...prev }
      const q = (next[itemId] ?? 0) + delta
      if (q <= 0) delete next[itemId]
      else next[itemId] = q
      return next
    })
  }

  const lines: (OrderLine & { name: string; price: number })[] = Object.entries(
    order,
  )
    .map(([itemId, qty]) => {
      const item = data.menu.find((m) => m.id === itemId)
      if (!item) return null
      return { itemId, qty, name: item.name, price: item.price }
    })
    .filter(Boolean) as (OrderLine & { name: string; price: number })[]

  const subtotal = lines.reduce((sum, l) => sum + l.price * l.qty, 0)
  const discountAmount = Math.min(subtotal, Math.max(0, discount))
  const total = subtotal - discountAmount
  const selectedTable = data.tables.find((t) => t.id === tableId)

  function reset() {
    setOrder({})
    setDiscount(0)
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl text-foreground">Billing Calculator</h2>
        <p className="text-sm text-muted-foreground">
          Build an order and calculate the bill in rupees.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Item picker */}
        <div className="rounded-xl border border-border bg-card/50 p-5">
          <div className="mb-4">
            <label className="mb-1.5 block text-sm text-muted-foreground">
              Table
            </label>
            <select
              value={tableId}
              onChange={(e) => setTableId(e.target.value)}
              className="w-full rounded-md border border-input bg-background/70 px-3 py-2 text-foreground outline-none focus:border-primary"
            >
              {data.tables.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} — {t.seats} seats
                </option>
              ))}
            </select>
          </div>

          <h3 className="mb-2 text-sm uppercase tracking-wide text-primary">
            Tap to add
          </h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {availableItems.map((item) => (
              <button
                key={item.id}
                onClick={() => addItem(item.id)}
                className="flex flex-col rounded-lg border border-border bg-background/40 p-3 text-left transition hover:border-primary hover:bg-secondary"
              >
                <span className="text-sm font-medium text-foreground">
                  {item.name}
                </span>
                <span className="mt-1 text-sm text-primary">
                  {formatRupees(item.price)}
                </span>
              </button>
            ))}
            {availableItems.length === 0 && (
              <p className="col-span-full text-sm text-muted-foreground">
                No available items. Add items in the Menu tab.
              </p>
            )}
          </div>
        </div>

        {/* Bill */}
        <div className="flex flex-col rounded-xl border border-border bg-card p-5">
          <div className="mb-3 flex items-center gap-2 text-foreground">
            <Receipt className="h-5 w-5 text-primary" />
            <h3 className="text-lg">Current Bill</h3>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            {selectedTable ? selectedTable.name : 'No table selected'}
          </p>

          <div className="flex-1 space-y-2">
            {lines.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No items added yet.
              </p>
            )}
            {lines.map((l) => (
              <div key={l.itemId} className="flex items-center gap-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-foreground">{l.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatRupees(l.price)} each
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => changeQty(l.itemId, -1)}
                    className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-5 text-center text-sm text-foreground">
                    {l.qty}
                  </span>
                  <button
                    onClick={() => changeQty(l.itemId, 1)}
                    className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <span className="w-20 text-right text-sm text-foreground">
                  {formatRupees(l.price * l.qty)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-2 border-t border-border pt-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatRupees(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Discount (₹)</span>
              <input
                type="number"
                min={0}
                value={discount || ''}
                onChange={(e) =>
                  setDiscount(Math.max(0, Number(e.target.value) || 0))
                }
                className="w-24 rounded-md border border-input bg-background/70 px-2 py-1 text-right text-foreground outline-none focus:border-primary"
                placeholder="0"
              />
            </div>
            <div className="flex justify-between border-t border-border pt-2 text-lg">
              <span className="font-serif text-foreground">Total</span>
              <span className="font-serif text-primary">
                {formatRupees(total)}
              </span>
            </div>
          </div>

          <button
            onClick={reset}
            disabled={lines.length === 0}
            className="mt-4 flex items-center justify-center gap-2 rounded-md border border-border py-2 text-sm text-foreground transition hover:bg-secondary disabled:opacity-40"
          >
            <Trash2 className="h-4 w-4" /> Clear Bill
          </button>
        </div>
      </div>
    </div>
  )
}
