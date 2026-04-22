import { AlertCircle, Clock, CheckCircle } from 'lucide-react'
import { Badge } from './badge'

interface Alert {
  id: string
  device: string
  type: string
  severity: string
  time: string
  status: string
}

interface AlertListProps {
  alerts: Alert[]
  limit?: number
}

export function AlertList({ alerts, limit }: AlertListProps) {
  const displayAlerts = limit ? alerts.slice(0, limit) : alerts

  return (
    <div className="space-y-3">
      {displayAlerts.map((alert) => (
        <div
          key={alert.id}
          className="rounded-lg border border-border bg-card p-4 flex items-start gap-4 hover:bg-muted/50 transition-colors"
        >
          <div className="pt-1">
            {alert.severity === 'critical' ? (
              <AlertCircle className="h-5 w-5 text-destructive" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-600" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-sm">{alert.type}</h4>
                <p className="text-xs text-muted-foreground mt-1">{alert.device}</p>
              </div>
              <Badge
                variant={alert.severity === 'critical' ? 'error' : 'warning'}
                label={alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
              />
            </div>
            <div className="flex items-center gap-4 mt-3">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {alert.time}
              </span>
              {alert.status === 'resolved' ? (
                <span className="text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Resolved
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">
                  {alert.status === 'acknowledged' ? 'Acknowledged' : 'Unresolved'}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
