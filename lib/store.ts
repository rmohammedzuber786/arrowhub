'use client'

import { useCallback } from 'react'
import useSWR from 'swr'
import { getAppData, saveAppData } from '@/app/actions/data'
import { DEFAULT_DATA, type AppData } from '@/lib/store-types'

export type {
  AppData,
  MenuItem,
  RestaurantTable,
  Settings,
} from '@/lib/store-types'
export { DEFAULT_DATA } from '@/lib/store-types'

export function useAppData() {
  const { data, mutate, isLoading } = useSWR<AppData>('app-data', getAppData, {
    revalidateOnFocus: false,
  })

  const current = data ?? DEFAULT_DATA

  const update = useCallback(
    (updater: (prev: AppData) => AppData) => {
      mutate(
        async (prev) => {
          const next = updater(prev ?? DEFAULT_DATA)
          return saveAppData(next)
        },
        {
          optimisticData: (prev) => updater(prev ?? DEFAULT_DATA),
          revalidate: false,
          populateCache: true,
          rollbackOnError: true,
        },
      )
    },
    [mutate],
  )

  return { data: current, update, loaded: !isLoading }
}

export function formatRupees(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}
