'use client'

import { useEffect, useState } from 'react'
import { Bell, BellOff, X } from 'lucide-react'
import {
  isNotificationSupported,
  requestNotificationPermission,
  getNotificationPermission,
  registerServiceWorker,
} from '@/lib/notifications'

export function NotificationSetup() {
  const [permission, setPermission] =
    useState<NotificationPermission>('default')
  const [showBanner, setShowBanner] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (!isNotificationSupported()) return

    const currentPermission = getNotificationPermission()
    setPermission(currentPermission)

    // Show banner only if not yet decided and not dismissed this session
    const wasDismissed = sessionStorage.getItem('notif-banner-dismissed')
    if (currentPermission === 'default' && !wasDismissed) {
      // Show after 3 seconds
      setTimeout(() => setShowBanner(true), 3000)
    }

    // Register service worker regardless
    registerServiceWorker()
  }, [])

  const handleEnable = async () => {
    const result = await requestNotificationPermission()
    setPermission(result)
    setShowBanner(false)

    if (result === 'granted') {
      // Show a test notification
      new Notification('NetCampus Notifications Enabled ✓', {
        body: 'You will now receive real-time network alerts',
        icon: '/icon.svg',
      })
    }
  }

  const handleDismiss = () => {
    setShowBanner(false)
    setDismissed(true)
    sessionStorage.setItem('notif-banner-dismissed', 'true')
  }

  if (!isNotificationSupported()) return null
  if (!showBanner || dismissed) return null
  if (permission !== 'default') return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
      <div className="rounded-xl border border-border bg-card shadow-lg p-4 flex items-start gap-3">
        {/* Icon */}
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Bell className="h-5 w-5 text-primary" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">Enable Network Alerts</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Get notified instantly when devices go offline — even when
            this tab is in the background
          </p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleEnable}
              className="flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-3 py-1.5 text-xs font-medium hover:opacity-90 transition-opacity"
            >
              <Bell className="h-3 w-3" />
              Enable Notifications
            </button>
            <button
              onClick={handleDismiss}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
            >
              Not now
            </button>
          </div>
        </div>

        {/* Close */}
        <button
          onClick={handleDismiss}
          className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}