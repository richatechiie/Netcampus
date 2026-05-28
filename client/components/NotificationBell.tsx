'use client'

import { useEffect, useState } from 'react'
import { Bell, BellOff, Check } from 'lucide-react'
import { useSocket } from '@/context/SocketContext'
import {
  showNotification,
  playAlertSound,
  getNotificationPermission,
  requestNotificationPermission,
  isNotificationSupported,
} from '@/lib/notifications'

interface AlertItem {
  id: string
  deviceName: string
  message: string
  severity: string
  timestamp: string
  read: boolean
}

export function NotificationBell() {
  const socket = useSocket()
  const [alerts, setAlerts] = useState<AlertItem[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [permission, setPermission] =
    useState<NotificationPermission>('default')

  useEffect(() => {
    if (isNotificationSupported()) {
      setPermission(getNotificationPermission())
    }
  }, [])

  useEffect(() => {
    if (!socket) return

    socket.on('alert', (newAlert: any) => {
      const alertItem: AlertItem = {
        id: newAlert.alertId || Date.now().toString(),
        deviceName: newAlert.deviceName || 'Unknown Device',
        message: newAlert.message || newAlert.type,
        severity: newAlert.severity || 'medium',
        timestamp: new Date().toLocaleTimeString(),
        read: false,
      }

      // Add to list
      setAlerts((prev) => [alertItem, ...prev].slice(0, 20))

      // Play sound
      playAlertSound(newAlert.severity)

      // Show browser notification if permission granted
      if (getNotificationPermission() === 'granted') {
        showNotification(
          newAlert.severity === 'critical'
            ? '🔴 Critical Alert — NetCampus'
            : newAlert.severity === 'low'
            ? '🟢 Device Online — NetCampus'
            : '🟡 Network Alert — NetCampus',
          {
            body: `${newAlert.deviceName}: ${newAlert.message}`,
            severity: newAlert.severity,
            url: '/alerts',
            tag: `alert-${newAlert.deviceId}`,
          }
        )
      }
    })

    return () => {
      socket.off('alert')
    }
  }, [socket])

  const unreadCount = alerts.filter((a) => !a.read).length

  const markAllRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })))
  }

  const clearAll = () => {
    setAlerts([])
    setShowDropdown(false)
  }

  const handleEnableNotifications = async () => {
    const result = await requestNotificationPermission()
    setPermission(result)
    if (result === 'granted') {
      new Notification('NetCampus Alerts Enabled ✓', {
        body: 'You will now receive real-time network alerts',
        icon: '/icon.svg',
      })
    }
  }

  return (
    <div className="relative">
      {/* Bell button */}
      <button
        onClick={() => {
          setShowDropdown(!showDropdown)
          if (!showDropdown) markAllRead()
        }}
        className="relative p-2 hover:bg-muted rounded-lg transition-colors"
        title="Notifications"
      >
        {permission === 'denied' ? (
          <BellOff className="h-5 w-5 text-muted-foreground" />
        ) : (
          <Bell className="h-5 w-5" />
        )}

        {/* Unread badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-bold animate-bounce">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}

        {/* Live pulse when no unread but socket connected */}
        {unreadCount === 0 && socket && permission === 'granted' && (
          <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDropdown(false)}
          />

          {/* Panel */}
          <div className="absolute right-0 top-12 w-96 rounded-xl border border-border bg-card shadow-xl z-50 overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {alerts.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>

            {/* Notification permission prompt */}
            {isNotificationSupported() && permission !== 'granted' && (
              <div className="px-4 py-3 bg-primary/5 border-b border-border">
                <p className="text-xs text-muted-foreground mb-2">
                  {permission === 'denied'
                    ? '🔕 Notifications blocked. Enable in browser settings.'
                    : '🔔 Enable notifications to get alerts in background'}
                </p>
                {permission !== 'denied' && (
                  <button
                    onClick={handleEnableNotifications}
                    className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity font-medium"
                  >
                    Enable Browser Notifications
                  </button>
                )}
              </div>
            )}

            {/* Permission granted indicator */}
            {permission === 'granted' && (
              <div className="px-4 py-2 bg-green-500/5 border-b border-border flex items-center gap-2">
                <Check className="h-3 w-3 text-green-500" />
                <p className="text-xs text-green-600 dark:text-green-400">
                  Browser notifications active
                </p>
              </div>
            )}

            {/* Alert list */}
            <div className="max-h-80 overflow-y-auto">
              {alerts.length === 0 ? (
                <div className="px-4 py-10 text-center">
                  <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-30" />
                  <p className="text-sm text-muted-foreground">
                    No notifications yet
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Alerts will appear here in real-time
                  </p>
                </div>
              ) : (
                alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`px-4 py-3 border-b border-border hover:bg-muted/50 transition-colors cursor-pointer ${
                      !alert.read ? 'bg-primary/3' : ''
                    }`}
                    onClick={() => {
                      window.location.href = '/alerts'
                      setShowDropdown(false)
                    }}
                  >
                    <div className="flex items-start gap-3">
                      {/* Severity dot */}
                      <div
                        className={`h-2 w-2 rounded-full mt-1.5 flex-shrink-0 ${
                          alert.severity === 'critical'
                            ? 'bg-destructive'
                            : alert.severity === 'low'
                            ? 'bg-green-500'
                            : 'bg-yellow-500'
                        }`}
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium truncate">
                            {alert.deviceName}
                          </p>
                          <span className="text-xs text-muted-foreground flex-shrink-0">
                            {alert.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {alert.message}
                        </p>
                        <span
                          className={`inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full ${
                            alert.severity === 'critical'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                              : alert.severity === 'low'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                          }`}
                        >
                          {alert.severity}
                        </span>
                      </div>

                      {/* Unread indicator */}
                      {!alert.read && (
                        <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {alerts.length > 0 && (
              <div className="px-4 py-3 border-t border-border">
                <button
                  onClick={() => {
                    window.location.href = '/alerts'
                    setShowDropdown(false)
                  }}
                  className="w-full text-xs text-center text-primary hover:underline font-medium"
                >
                  View all alerts →
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}