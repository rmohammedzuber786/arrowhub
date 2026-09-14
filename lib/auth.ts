'use client'

import { useCallback, useEffect, useState } from 'react'

// Simple hardcoded credentials as requested.
const VALID_USERNAME = 'admin'
const VALID_PASSWORD = 'arrowhub'
const AUTH_KEY = 'arrow-hub-auth'

export function useAuth() {
  const [authed, setAuthed] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setAuthed(localStorage.getItem(AUTH_KEY) === 'true')
    setLoaded(true)
  }, [])

  const login = useCallback((username: string, password: string) => {
    if (username.trim() === VALID_USERNAME && password === VALID_PASSWORD) {
      localStorage.setItem(AUTH_KEY, 'true')
      setAuthed(true)
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY)
    setAuthed(false)
  }, [])

  return { authed, loaded, login, logout }
}
