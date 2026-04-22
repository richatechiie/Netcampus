'use client'

import { useState } from 'react'
import { LayoutWrapper } from '@/components/layout-wrapper'
import { AlertList } from '@/components/alert-list'
import { alertData } from '@/lib/data/dummy-data'
import { Filter, Trash2 } from 'lucide-react'

export default function AlertsPage() {
  const [severityFilter, setSeverityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredAlerts = alertData.filter((alert) => {
    const severityMatch = severityFilter === 'all' || alert.severity === severityFilter
    const statusMatch = statusFilter === 'all' || alert.status === statusFilter
    return severityMatch && statusMatch
  })

  const stats = {
    critical: alertData.filter((a) => a.severity === 'critical').length,
    warning: alertData.filter((a) => a.severity === 'warning').length,
    unresolved: alertData.filter((a) => a.status === 'unresolved').length,
  }

  return (
    <LayoutWrapper>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold">Alerts</h1>
          <p className="text-muted-foreground mt-2">Monitor and manage network alerts</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Critical Alerts</p>
            <p className="text-2xl font-bold mt-2 text-destructive">{stats.critical}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Warning Alerts</p>
            <p className="text-2xl font-bold mt-2 text-yellow-600">{stats.warning}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Unresolved</p>
            <p className="text-2xl font-bold mt-2">{stats.unresolved}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Severity Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All Severity</option>
                <option value="critical">Critical</option>
                <option value="warning">Warning</option>
              </select>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Status</option>
              <option value="unresolved">Unresolved</option>
              <option value="acknowledged">Acknowledged</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          {/* Clear All Button */}
          <button className="flex items-center gap-2 rounded-lg text-destructive hover:bg-destructive/10 px-4 py-2 font-medium transition-colors">
            <Trash2 className="h-4 w-4" />
            Clear Resolved
          </button>
        </div>

        {/* Alert Timeline */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">
              {filteredAlerts.length} Alert{filteredAlerts.length !== 1 ? 's' : ''}
            </h2>
          </div>
          <AlertList alerts={filteredAlerts} />
        </div>
      </div>
    </LayoutWrapper>
  )
}
