// lib/notifications.ts

export const NOTIFICATION_PERMISSION = {
  GRANTED: 'granted',
  DENIED: 'denied',
  DEFAULT: 'default',
}

// Check if notifications are supported
export const isNotificationSupported = () => {
  return (
    typeof window !== 'undefined' &&
    'Notification' in window &&
    'serviceWorker' in navigator
  )
}

// Request notification permission
export const requestNotificationPermission =
  async (): Promise<NotificationPermission> => {
    if (!isNotificationSupported()) return 'denied'
    const permission = await Notification.requestPermission()
    return permission
  }

// Get current permission status
export const getNotificationPermission = (): NotificationPermission => {
  if (!isNotificationSupported()) return 'denied'
  return Notification.permission
}

// Register service worker
export const registerServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) return null
  try {
    const registration = await navigator.serviceWorker.register('/sw.js')
    console.log('Service worker registered:', registration.scope)
    return registration
  } catch (err) {
    console.error('Service worker registration failed:', err)
    return null
  }
}

// Show a browser notification directly
export const showNotification = (
  title: string,
  options: {
    body: string
    severity?: string
    url?: string
    tag?: string
  }
) => {
  if (!isNotificationSupported()) return
  if (Notification.permission !== 'granted') return

  const notification = new Notification(title, {
    body: options.body,
    icon: '/icon.svg',
    badge: '/icon-light-32x32.png',
    tag: options.tag || 'netcampus',
    requireInteraction: options.severity === 'critical',
  })

  notification.onclick = () => {
    window.focus()
    if (options.url) window.location.href = options.url
    notification.close()
  }

  // Auto close after 8 seconds for non-critical
  if (options.severity !== 'critical') {
    setTimeout(() => notification.close(), 8000)
  }
}

// Play alert sound
export const playAlertSound = (severity: string) => {
  try {
    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)()

    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    if (severity === 'critical') {
      // Urgent beep beep beep
      oscillator.frequency.setValueAtTime(880, audioContext.currentTime)
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime + 0.2)
      oscillator.frequency.setValueAtTime(880, audioContext.currentTime + 0.4)
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.6
      )
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.6)
    } else if (severity === 'medium') {
      // Single ding
      oscillator.frequency.setValueAtTime(660, audioContext.currentTime)
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.4
      )
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.4)
    } else {
      // Soft chime for low severity
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime)
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.3
      )
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
    }
  } catch (err) {
    console.log('Audio not supported:', err)
  }
}