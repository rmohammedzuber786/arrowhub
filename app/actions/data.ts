'use server'

import { pool } from '@/lib/db'
import { DEFAULT_DATA, type AppData } from '@/lib/store-types'

async function seedIfEmpty() {
  const { rows } = await pool.query('SELECT id FROM settings WHERE id = 1')
  if (rows.length > 0) return

  const s = DEFAULT_DATA.settings
  await pool.query(
    'INSERT INTO settings (id, restaurant_name, tagline, logo) VALUES (1, $1, $2, $3) ON CONFLICT (id) DO NOTHING',
    [s.restaurantName, s.tagline, s.logo],
  )
  for (let i = 0; i < DEFAULT_DATA.tables.length; i++) {
    const t = DEFAULT_DATA.tables[i]
    await pool.query(
      'INSERT INTO restaurant_tables (id, name, seats, sort_order) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING',
      [t.id, t.name, t.seats, i],
    )
  }
  for (let i = 0; i < DEFAULT_DATA.menu.length; i++) {
    const m = DEFAULT_DATA.menu[i]
    await pool.query(
      'INSERT INTO menu_items (id, name, description, price, category, available, sort_order) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (id) DO NOTHING',
      [m.id, m.name, m.description, m.price, m.category, m.available, i],
    )
  }
}

export async function getAppData(): Promise<AppData> {
  await seedIfEmpty()

  const [settingsRes, tablesRes, menuRes] = await Promise.all([
    pool.query('SELECT restaurant_name, tagline, logo FROM settings WHERE id = 1'),
    pool.query('SELECT id, name, seats FROM restaurant_tables ORDER BY sort_order, id'),
    pool.query(
      'SELECT id, name, description, price, category, available FROM menu_items ORDER BY sort_order, id',
    ),
  ])

  const s = settingsRes.rows[0]
  return {
    settings: s
      ? { restaurantName: s.restaurant_name, tagline: s.tagline, logo: s.logo }
      : DEFAULT_DATA.settings,
    tables: tablesRes.rows.map((t) => ({
      id: t.id,
      name: t.name,
      seats: Number(t.seats),
    })),
    menu: menuRes.rows.map((m) => ({
      id: m.id,
      name: m.name,
      description: m.description,
      price: Number(m.price),
      category: m.category,
      available: m.available,
    })),
  }
}

export async function saveAppData(data: AppData): Promise<AppData> {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    await client.query(
      `INSERT INTO settings (id, restaurant_name, tagline, logo)
       VALUES (1, $1, $2, $3)
       ON CONFLICT (id) DO UPDATE
       SET restaurant_name = EXCLUDED.restaurant_name,
           tagline = EXCLUDED.tagline,
           logo = EXCLUDED.logo`,
      [data.settings.restaurantName, data.settings.tagline, data.settings.logo],
    )

    const tableIds = data.tables.map((t) => t.id)
    await client.query(
      'DELETE FROM restaurant_tables WHERE NOT (id = ANY($1::text[]))',
      [tableIds],
    )
    for (let i = 0; i < data.tables.length; i++) {
      const t = data.tables[i]
      await client.query(
        `INSERT INTO restaurant_tables (id, name, seats, sort_order)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO UPDATE
         SET name = EXCLUDED.name, seats = EXCLUDED.seats, sort_order = EXCLUDED.sort_order`,
        [t.id, t.name, t.seats, i],
      )
    }

    const menuIds = data.menu.map((m) => m.id)
    await client.query(
      'DELETE FROM menu_items WHERE NOT (id = ANY($1::text[]))',
      [menuIds],
    )
    for (let i = 0; i < data.menu.length; i++) {
      const m = data.menu[i]
      await client.query(
        `INSERT INTO menu_items (id, name, description, price, category, available, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO UPDATE
         SET name = EXCLUDED.name, description = EXCLUDED.description,
             price = EXCLUDED.price, category = EXCLUDED.category,
             available = EXCLUDED.available, sort_order = EXCLUDED.sort_order`,
        [m.id, m.name, m.description, m.price, m.category, m.available, i],
      )
    }

    await client.query('COMMIT')
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }

  return data
}
