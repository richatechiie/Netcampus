'use client'

import { RefreshCw, Pause, Play } from 'lucide-react'

interface RefreshBarProps {
  countdown: number
  isRefreshing: boolean
  lastRefreshed: Date | null
  isPaused: boolean
  intervalSeconds?: number
  onRefresh: () => void
  onPause: () => void
  onResume: () => void
}

export function RefreshBar({
  countdown,
  isRefreshing,
  lastRefreshed,
  isPaused,
  intervalSeconds = 30,
  onRefresh,
  onPause,
  onResume,
}: RefreshBarProps) {
  const progress = isPaused
    ? 100
    : ((intervalSeconds - countdown) / intervalSeconds) * 100

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Progress bar at top */}
      <div className="h-0.5 bg-muted w-full">
        <div
          className={`h-full transition-all duration-1000 ease-linear ${
            isPaused
              ? 'bg-muted-foreground/30'
              : isRefreshing
              ? 'bg-primary animate-pulse'
              : 'bg-primary'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="px-4 py-3 flex items-center justify-between gap-4">
        {/* Left — status */}
        <div className="flex items-center gap-3">
          {/* Live indicator */}
          <div className="flex items-center gap-1.5">
            {isRefreshing ? (
              <RefreshCw className="h-3.5 w-3.5 text-primary animate-spin" />
            ) : isPaused ? (
              <div className="h-2 w-2 rounded-full bg-muted-foreground" />
            ) : (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
            )}
            <span className="text-xs font-medium text-muted-foreground">
              {isRefreshing
                ? 'Refreshing...'
                : isPaused
                ? 'Paused'
                : 'Live'}
            </span>
          </div>

          {/* Divider */}
          <div className="h-3 w-px bg-border" />

          {/* Countdown */}
          {!isPaused && !isRefreshing && (
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">
                Next refresh in
              </span>
              <span
                className={`text-xs font-mono font-bold tabular-nums ${
                  countdown <= 5
                    ? 'text-primary'
                    : 'text-foreground'
                }`}
              >
                {countdown}s
              </span>
            </div>
          )}

          {/* Countdown ring */}
          {!isPaused && !isRefreshing && (
            <div className="relative h-5 w-5">
              <svg
                className="h-5 w-5 -rotate-90"
                viewBox="0 0 20 20"
              >
                {/* Background circle */}
                <circle
                  cx="10"
                  cy="10"
                  r="8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-muted/40"
                />
                {/* Progress circle */}
                <circle
                  cx="10"
                  cy="10"
                  r="8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray={`${2 * Math.PI * 8}`}
                  strokeDashoffset={`${
                    2 *
                    Math.PI *
                    8 *
                    (1 - (intervalSeconds - countdown) / intervalSeconds)
                  }`}
                  className="text-primary transition-all duration-1000 ease-linear"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Right — controls + last refresh */}
        <div className="flex items-center gap-3">
          {/* Last refreshed */}
          {lastRefreshed && (
            <span className="text-xs text-muted-foreground hidden sm:block">
              Last updated: {formatTime(lastRefreshed)}
            </span>
          )}

          {/* Divider */}
          {lastRefreshed && <div className="h-3 w-px bg-border hidden sm:block" />}

          {/* Manual refresh button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            title="Refresh now"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`}
            />
            <span className="hidden sm:block">Refresh</span>
          </button>

          {/* Pause / Resume button */}
          <button
            onClick={isPaused ? onResume : onPause}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            title={isPaused ? 'Resume auto-refresh' : 'Pause auto-refresh'}
          >
            {isPaused ? (
              <>
                <Play className="h-3.5 w-3.5" />
                <span className="hidden sm:block">Resume</span>
              </>
            ) : (
              <>
                <Pause className="h-3.5 w-3.5" />
                <span className="hidden sm:block">Pause</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}