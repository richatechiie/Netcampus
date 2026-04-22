'use client'

import { useEffect, useState } from 'react'
import { LayoutWrapper } from '@/components/layout-wrapper'
import { DeviceTable } from '@/components/device-table'
import deviceService from '@/lib/services/deviceService'
import { useSocket } from '@/context/SocketContext'
import { Filter, Download, Plus } from 'lucide-react'

export default function DevicesPage() {
  const [devices, setDevices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    ipAddress: '',
    macAddress: '',
    type: 'router',
    location: '',
    zone: 'general',
  })
  const socket = useSocket()

  const fetchDevices = async () => {
    try {
      const res = await deviceService.getAll()
      setDevices(res.devices || [])
    } catch (err) {
      console.error('Failed to fetch devices:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDevices()
  }, [])

  // Real-time status update via socket
  useEffect(() => {
    if (!socket) return
    socket.on('device_status_change', ({ deviceId, newStatus }: any) => {
      setDevices((prev) =>
        prev.map((d) =>
          d._id === deviceId ? { ...d, status: newStatus } : d
        )
      )
    })
    return () => { socket.off('device_status_change') }
  }, [socket])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await deviceService.create(form)
      setShowForm(false)
      setForm({
        name: '',
        ipAddress: '',
        macAddress: '',
        type: 'router',
        location: '',
        zone: 'general',
      })
      fetchDevices()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create device')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this device?')) return
    try {
      await deviceService.remove(id)
      setDevices((prev) => prev.filter((d) => d._id !== id))
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  // Map backend data to shape DeviceTable expects
  const formatted = devices.map((d: any) => ({
    id: d._id,
    name: d.name,
    type: d.type,
    status: d.status,
    uptime: d.lastSeen
      ? new Date(d.lastSeen).toLocaleString()
      : 'Never seen',
    cpu: 0,
    memory: 0,
    location: d.location,
    ip: d.ipAddress,
  }))

  const deviceTypes = Array.from(new Set(formatted.map((d) => d.type)))

  const filtered = formatted.filter((d) => {
    const statusMatch = statusFilter === 'all' || d.status === statusFilter
    const typeMatch = typeFilter === 'all' || d.type === typeFilter
    return statusMatch && typeMatch
  })

  return (
    <LayoutWrapper>
      <div className="space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold">Devices</h1>
            <p className="text-muted-foreground mt-2">
              Manage and monitor all network devices
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" />
            Add Device
          </button>
        </div>

        {/* Add Device Form */}
        {showForm && (
          <form
            onSubmit={handleCreate}
            className="rounded-xl border border-border bg-card p-6 space-y-4"
          >
            <h2 className="text-lg font-semibold">Add New Device</h2>

            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Device Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="e.g. Core Router 1"
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">IP Address</label>
                <input
                  value={form.ipAddress}
                  onChange={(e) => setForm({ ...form, ipAddress: e.target.value })}
                  required
                  placeholder="e.g. 192.168.1.1"
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">MAC Address</label>
                <input
                  value={form.macAddress}
                  onChange={(e) => setForm({ ...form, macAddress: e.target.value })}
                  placeholder="e.g. AA:BB:CC:DD:EE:FF"
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Location</label>
                <input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  required
                  placeholder="e.g. Server Room"
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Device Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="router">Router</option>
                  <option value="switch">Switch</option>
                  <option value="access_point">Access Point</option>
                  <option value="server">Server</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Zone</label>
                <input
                  value={form.zone}
                  onChange={(e) => setForm({ ...form, zone: e.target.value })}
                  placeholder="e.g. general"
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-primary text-primary-foreground px-5 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? 'Adding...' : 'Add Device'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setError('') }}
                className="rounded-lg border border-border px-5 py-2 text-sm font-medium hover:bg-muted"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4">
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
                <option value="degraded">Degraded</option>
              </select>
            </div>

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

          <button
            onClick={() => {
              const csv = [
                ['Name', 'IP', 'Type', 'Status', 'Location'].join(','),
                ...devices.map((d: any) =>
                  [d.name, d.ipAddress, d.type, d.status, d.location].join(',')
                ),
              ].join('\n')
              const blob = new Blob([csv], { type: 'text/csv' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'devices.csv'
              a.click()
            }}
            className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total Devices</p>
            <p className="text-2xl font-bold mt-2">{devices.length}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Online</p>
            <p className="text-2xl font-bold mt-2 text-green-500">
              {devices.filter((d) => d.status === 'online').length}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Offline</p>
            <p className="text-2xl font-bold mt-2 text-destructive">
              {devices.filter((d) => d.status === 'offline').length}
            </p>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <p className="text-muted-foreground">Loading devices...</p>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <p className="text-muted-foreground">No devices found.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Add your first device using the button above.
            </p>
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-semibold mb-4">
              {filtered.length} Device{filtered.length !== 1 ? 's' : ''}
            </h2>
            <DeviceTable devices={filtered} />
          </div>
        )}

      </div>
    </LayoutWrapper>
  )
}