'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { NotificationBell } from '@/components/NotificationBell'

export function Topbar() {
  const { theme, setTheme } = useTheme()
  const { user } = useAuth()

  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">
          Welcome back,{' '}
          <span className="font-medium text-foreground">
            {user?.name || 'User'}
          </span>
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          title="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>

        {/* Notification bell */}
        <NotificationBell />

        {/* User avatar */}
        <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center cursor-pointer">
          <span className="text-xs font-bold text-primary-foreground">
            {user?.name
              ?.split(' ')
              .map((n: string) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2) || 'U'}
          </span>
        </div>
      </div>
    </header>
  )
}