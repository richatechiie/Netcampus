import { useEffect, useRef, useState, useCallback } from 'react'

interface UseAutoRefreshOptions {
  intervalSeconds?: number
  onRefresh: () => Promise<void>
  enabled?: boolean
}

interface UseAutoRefreshReturn {
  countdown: number
  isRefreshing: boolean
  lastRefreshed: Date | null
  refresh: () => void
  pause: () => void
  resume: () => void
  isPaused: boolean
}

export function useAutoRefresh({
  intervalSeconds = 30,
  onRefresh,
  enabled = true,
}: UseAutoRefreshOptions): UseAutoRefreshReturn {
  const [countdown, setCountdown] = useState(intervalSeconds)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null)
  const [isPaused, setIsPaused] = useState(false)

  const countdownRef = useRef(intervalSeconds)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const pausedRef = useRef(false)

  const runRefresh = useCallback(async () => {
    if (isRefreshing) return
    setIsRefreshing(true)
    try {
      await onRefresh()
      setLastRefreshed(new Date())
    } catch (err) {
      console.error('Auto refresh error:', err)
    } finally {
      setIsRefreshing(false)
      countdownRef.current = intervalSeconds
      setCountdown(intervalSeconds)
    }
  }, [onRefresh, intervalSeconds, isRefreshing])

  const manualRefresh = useCallback(() => {
    runRefresh()
  }, [runRefresh])

  const pause = useCallback(() => {
    pausedRef.current = true
    setIsPaused(true)
  }, [])

  const resume = useCallback(() => {
    pausedRef.current = false
    setIsPaused(false)
    countdownRef.current = intervalSeconds
    setCountdown(intervalSeconds)
  }, [intervalSeconds])

  useEffect(() => {
    if (!enabled) return

    timerRef.current = setInterval(() => {
      if (pausedRef.current) return

      countdownRef.current -= 1
      setCountdown(countdownRef.current)

      if (countdownRef.current <= 0) {
        runRefresh()
      }
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [enabled, runRefresh])

  return {
    countdown,
    isRefreshing,
    lastRefreshed,
    refresh: manualRefresh,
    pause,
    resume,
    isPaused,
  }
}