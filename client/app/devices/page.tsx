'use client'

import { useState } from 'react'
import { LayoutWrapper } from '@/components/layout-wrapper'
import { DeviceTable } from '@/components/device-table'
import { deviceData } from '@/lib/data/dummy-data'
import { Filter, Download } from 'lucide-react'

export default function DevicesPage() {
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  const filteredDevices = deviceData.filter((device) => {
    const statusMatch = statusFilter === 'all' || device.status === statusFilter
    const typeMatch = typeFilter === 'all' || device.type === typeFilter
    return statusMatch && typeMatch
  })

  const deviceTypes = Array.from(new Set(deviceData.map((d) => d.type)))

  return (
    <LayoutWrapper>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold">Devices</h1>
          <p className="text-muted-foreground mt-2">Manage and monitor all network devices</p>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All Status</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </div>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Types</option>
              {deviceTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Export Button */}
          <button className="flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 font-medium hover:opacity-90 transition-opacity">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total Devices</p>
            <p className="text-2xl font-bold mt-2">{deviceData.length}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Online</p>
            <p className="text-2xl font-bold mt-2">
              {deviceData.filter((d) => d.status === 'online').length}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Offline</p>
            <p className="text-2xl font-bold mt-2">
              {deviceData.filter((d) => d.status === 'offline').length}
            </p>
          </div>
        </div>

        {/* Table */}
        <div>
          <h2 className="text-lg font-semibold mb-4">
            {filteredDevices.length} Device{filteredDevices.length !== 1 ? 's' : ''}
          </h2>
          <DeviceTable devices={filteredDevices} />
        </div>
      </div>
    </LayoutWrapper>
  )
}
