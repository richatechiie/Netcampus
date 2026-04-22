import { LayoutWrapper } from '@/components/layout-wrapper'
import { StatCard } from '@/components/stat-card'
import { AlertList } from '@/components/alert-list'
import { UptimeChart } from '@/components/uptime-chart'
import { DeviceTable } from '@/components/device-table'
import {
  dashboardStats,
  alertData,
  chartData,
  deviceData,
} from '@/lib/data/dummy-data'

export default function DashboardPage() {
  return (
    <LayoutWrapper>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Monitor your network infrastructure in real-time</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardStats.map((stat) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              change={stat.change}
              trend={stat.trend as 'up' | 'down'}
            />
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <UptimeChart data={chartData} title="Network Activity (24h)" height={300} />
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Alerts</h3>
            <AlertList alerts={alertData} limit={4} />
          </div>
        </div>

        {/* Devices Table */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold">Network Devices</h2>
            <p className="text-muted-foreground text-sm mt-1">Overview of all connected devices</p>
          </div>
          <DeviceTable devices={deviceData} />
        </div>
      </div>
    </LayoutWrapper>
  )
}
