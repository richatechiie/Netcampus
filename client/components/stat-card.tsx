import { ArrowDown, ArrowUp } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string
  change?: string
  trend?: 'up' | 'down'
}

export function StatCard({ label, value, change, trend }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="mt-4 flex items-end justify-between">
        <h3 className="text-3xl font-bold">{value}</h3>
        {change && trend && (
          <div className="flex items-center gap-1">
            {trend === 'up' ? (
              <ArrowUp className="h-4 w-4 text-destructive" />
            ) : (
              <ArrowDown className="h-4 w-4 text-green-600" />
            )}
            <span className={trend === 'up' ? 'text-destructive text-sm' : 'text-green-600 text-sm'}>
              {change}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
