'use client'

import { useEffect, useState, useCallback } from 'react'
import { LayoutWrapper } from '@/components/layout-wrapper'
import { StatCard } from '@/components/stat-card'
import { AlertList } from '@/components/alert-list'
import { UptimeChart } from '@/components/uptime-chart'
import { DeviceTable } from '@/components/device-table'
import { LatencyGraph } from '@/components/LatencyGraph'
import { useAuth } from '@/context/AuthContext'
import { useSocket } from '@/context/SocketContext'
import analyticsService from '@/lib/services/analyticsService'
import alertService from '@/lib/services/alertService'
import deviceService from '@/lib/services/deviceService'
import ticketService from '@/lib/services/ticketService'
import { useAutoRefresh } from '@/hooks/useAutoRefresh'
import { RefreshBar } from '@/components/RefreshBar'
import {
  Plus, Ticket, Wifi, AlertCircle,
  CheckCircle, User, Clock
} from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()
  const role = user?.role || 'student'

  if (role === 'admin') return <AdminDashboard />
  if (role === 'it_staff') return <ITStaffDashboard />
  return <StudentDashboard />
}

// ─────────────────────────────────────────────
// ADMIN DASHBOARD
// ─────────────────────────────────────────────
function AdminDashboard() {
  const socket = useSocket()
  const [summary, setSummary] = useState<any>(null)
  const [alerts, setAlerts] = useState<any[]>([])
  const [devices, setDevices] = useState<any[]>([])
  const [chartData, setChartData] = useState<any[]>([])
  const [ticketStats, setTicketStats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    try {
      const [sum, alertRes, deviceRes, alertsByDay, tickets] =
        await Promise.all([
          analyticsService.getSummary(),
          alertService.getAll({ limit: 5 }),
          deviceService.getAll(),
          analyticsService.getAlertsByDay(),
          analyticsService.getTicketStats(),
        ])
      setSummary(sum)
      setAlerts(alertRes.alerts || [])
      setDevices(deviceRes.devices || [])
      setChartData(alertsByDay.data || [])
      setTicketStats(tickets.data || [])
    } catch (err) {
      console.error('Admin dashboard error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const { countdown, isRefreshing, lastRefreshed, isPaused, refresh, pause, resume } =
    useAutoRefresh({ intervalSeconds: 30, onRefresh: fetchAll })

  useEffect(() => {
    if (!socket) return
    socket.on('alert', (newAlert: any) => {
      setAlerts(prev => [newAlert, ...prev].slice(0, 5))
    })
    socket.on('device_status_change', ({ deviceId, newStatus }: any) => {
      setDevices(prev =>
        prev.map(d => d._id === deviceId ? { ...d, status: newStatus } : d)
      )
    })
    return () => { socket.off('alert'); socket.off('device_status_change') }
  }, [socket])

  const stats = summary ? [
    { label: 'Total Devices', value: String(summary.totalDevices), change: '', trend: 'up' as const },
    { label: 'Network Uptime', value: `${summary.uptimePercent}%`, change: '', trend: 'up' as const },
    { label: 'Active Alerts', value: String(summary.unresolvedAlerts), change: '', trend: 'down' as const },
    { label: 'Open Tickets', value: String(summary.openTickets), change: '', trend: 'down' as const },
  ] : []

  if (loading) return <DashboardSkeleton />

  return (
    <LayoutWrapper>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-2">Full network overview — Admin view</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium text-primary">Admin Access</span>
          </div>
        </div>

        <RefreshBar
          countdown={countdown} isRefreshing={isRefreshing}
          lastRefreshed={lastRefreshed} isPaused={isPaused}
          intervalSeconds={30} onRefresh={refresh}
          onPause={pause} onResume={resume}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(stat => <StatCard key={stat.label} {...stat} />)}
        </div>

        <LatencyGraph />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <UptimeChart
              data={chartData.map((d: any) => ({ time: d._id, alerts: d.count }))}
              title="Alerts per day (last 7 days)"
              height={300}
            />
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Alerts</h3>
            <AlertList
              alerts={alerts.map((a: any) => ({
                id: a._id,
                device: a.device?.name || a.deviceName || 'Unknown',
                type: a.type,
                severity: a.severity,
                time: a.createdAt ? new Date(a.createdAt).toLocaleString() : 'just now',
                status: a.acknowledged ? 'acknowledged' : 'unresolved',
              }))}
              limit={5}
            />
          </div>
        </div>

        {ticketStats.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Ticket Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {ticketStats.map((s: any) => (
                <div key={s._id} className="rounded-lg bg-muted p-4">
                  <p className="text-sm text-muted-foreground capitalize">
                    {s._id.replace('_', ' ')}
                  </p>
                  <p className="text-2xl font-bold mt-1">{s.count}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold">All Network Devices</h2>
            <p className="text-muted-foreground text-sm mt-1">
              {devices.filter(d => d.status === 'online').length} of {devices.length} devices online
            </p>
          </div>
          <DeviceTable
            devices={devices.map((d: any) => ({
              id: d._id, name: d.name, type: d.type, status: d.status,
              uptime: d.lastSeen ? new Date(d.lastSeen).toLocaleString() : 'Never',
              cpu: 0, memory: 0, location: d.location, ip: d.ipAddress,
            }))}
          />
        </div>
      </div>
    </LayoutWrapper>
  )
}

// ─────────────────────────────────────────────
// IT STAFF DASHBOARD
// ─────────────────────────────────────────────
function ITStaffDashboard() {
  const { user } = useAuth()
  const socket = useSocket()
  const [summary, setSummary] = useState<any>(null)
  const [alerts, setAlerts] = useState<any[]>([])
  const [devices, setDevices] = useState<any[]>([])
  const [tickets, setTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    try {
      const [sum, alertRes, deviceRes, ticketRes] = await Promise.all([
        analyticsService.getSummary(),
        alertService.getAll({ limit: 10, acknowledged: false }),
        deviceService.getAll(),
        ticketService.getAll({ status: 'open' }),
      ])
      setSummary(sum)
      setAlerts(alertRes.alerts || [])
      setDevices(deviceRes.devices || [])
      setTickets(ticketRes.tickets || [])
    } catch (err) {
      console.error('IT Staff dashboard error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const { countdown, isRefreshing, lastRefreshed, isPaused, refresh, pause, resume } =
    useAutoRefresh({ intervalSeconds: 30, onRefresh: fetchAll })

  // Live socket updates
  useEffect(() => {
    if (!socket) return
    socket.on('alert', (newAlert: any) => {
      setAlerts(prev => [newAlert, ...prev])
    })
    socket.on('device_status_change', ({ deviceId, newStatus }: any) => {
      setDevices(prev =>
        prev.map(d => d._id === deviceId ? { ...d, status: newStatus } : d)
      )
    })
    return () => { socket.off('alert'); socket.off('device_status_change') }
  }, [socket])

  // One-click acknowledge alert
  const handleAcknowledge = async (alertId: string) => {
    try {
      await alertService.acknowledge(alertId)
      setAlerts(prev => prev.filter(a => (a._id || a.alertId) !== alertId))
    } catch (err) { console.error(err) }
  }

  // One-click assign ticket to self
  const handleAssignToMe = async (ticketId: string) => {
    try {
      await ticketService.update(ticketId, {
        assignedTo: user?.id,
        status: 'in_progress',
      })
      fetchAll()
    } catch (err) { console.error(err) }
  }

  const offlineDevices = devices.filter(d => d.status === 'offline')
  const onlineDevices = devices.filter(d => d.status === 'online')
  const criticalAlerts = alerts.filter(a => a.severity === 'critical')

  if (loading) return <DashboardSkeleton />

  return (
    <LayoutWrapper>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              IT Operations view — {user?.name}
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs font-medium text-blue-500">IT Staff Access</span>
          </div>
        </div>

        {/* Refresh bar */}
        <RefreshBar
          countdown={countdown} isRefreshing={isRefreshing}
          lastRefreshed={lastRefreshed} isPaused={isPaused}
          intervalSeconds={30} onRefresh={refresh}
          onPause={pause} onResume={resume}
        />

        {/* Priority Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Offline Devices</p>
            <p className={`text-3xl font-bold mt-2 ${offlineDevices.length > 0 ? 'text-destructive' : 'text-green-500'}`}>
              {offlineDevices.length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {onlineDevices.length} online
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Critical Alerts</p>
            <p className={`text-3xl font-bold mt-2 ${criticalAlerts.length > 0 ? 'text-destructive' : 'text-green-500'}`}>
              {criticalAlerts.length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {alerts.length} total unresolved
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Open Tickets</p>
            <p className="text-3xl font-bold mt-2">{tickets.length}</p>
            <p className="text-xs text-muted-foreground mt-1">awaiting action</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Network Uptime</p>
            <p className="text-3xl font-bold mt-2 text-green-500">
              {summary?.uptimePercent ?? 0}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">last 24 hours</p>
          </div>
        </div>

        {/* Live Latency Graph */}
        <LatencyGraph />

        {/* Offline devices red banner */}
        {offlineDevices.length > 0 && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <h3 className="text-lg font-semibold text-destructive">
                Offline Devices — Immediate Attention Required
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {offlineDevices.map((device: any) => (
                <div
                  key={device._id}
                  className="rounded-lg border border-destructive/20 bg-card p-4 flex items-center gap-3"
                >
                  <div className="h-3 w-3 rounded-full bg-destructive flex-shrink-0 animate-pulse" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{device.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {device.ipAddress} · {device.location}
                    </p>
                  </div>
                  <span className="text-xs text-destructive font-medium px-2 py-1 rounded-full bg-destructive/10">
                    Offline
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alert queue + Ticket queue */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Alert queue */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Alert Queue</h3>
              <span className="text-xs text-muted-foreground">
                {alerts.length} unacknowledged
              </span>
            </div>
            {alerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 gap-2">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <p className="text-sm text-muted-foreground">All alerts resolved</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {alerts.map((alert: any) => (
                  <div
                    key={alert._id || alert.alertId}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className={`h-2 w-2 rounded-full mt-1.5 flex-shrink-0 ${
                      alert.severity === 'critical' ? 'bg-destructive'
                      : alert.severity === 'low' ? 'bg-green-500'
                      : 'bg-yellow-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">
                        {alert.device?.name || alert.deviceName || 'Unknown'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {alert.message || alert.type}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        alert.severity === 'critical'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          : alert.severity === 'low'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                      }`}>
                        {alert.severity}
                      </span>
                      <button
                        onClick={() => handleAcknowledge(alert._id || alert.alertId)}
                        className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors font-medium"
                      >
                        ✓ Ack
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Open ticket queue */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Open Ticket Queue</h3>
              <span className="text-xs text-muted-foreground">
                {tickets.length} pending
              </span>
            </div>
            {tickets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 gap-2">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <p className="text-sm text-muted-foreground">No open tickets</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {tickets.map((ticket: any) => (
                  <div
                    key={ticket._id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className={`h-2 w-2 rounded-full mt-1.5 flex-shrink-0 ${
                      ticket.priority === 'critical' || ticket.priority === 'high'
                        ? 'bg-destructive'
                        : ticket.priority === 'medium'
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{ticket.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {ticket.raisedBy?.name || 'Unknown'} · {ticket.category}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        ticket.priority === 'high' || ticket.priority === 'critical'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          : ticket.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                          : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      }`}>
                        {ticket.priority}
                      </span>
                      {!ticket.assignedTo && (
                        <button
                          onClick={() => handleAssignToMe(ticket._id)}
                          className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium"
                        >
                          Assign me
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Device health grid */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Device Health</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {devices.map((device: any) => (
              <div
                key={device._id}
                className={`rounded-xl border p-4 flex items-center gap-4 ${
                  device.status === 'offline'
                    ? 'border-destructive/30 bg-destructive/5'
                    : device.status === 'degraded'
                    ? 'border-yellow-500/30 bg-yellow-500/5'
                    : 'border-border bg-card'
                }`}
              >
                <div className={`h-3 w-3 rounded-full flex-shrink-0 ${
                  device.status === 'online' ? 'bg-green-500'
                  : device.status === 'degraded' ? 'bg-yellow-500'
                  : 'bg-destructive'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{device.name}</p>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">
                    {device.ipAddress}
                  </p>
                  <p className="text-xs text-muted-foreground">{device.location}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-xs font-medium capitalize ${
                    device.status === 'online' ? 'text-green-500'
                    : device.status === 'degraded' ? 'text-yellow-500'
                    : 'text-destructive'
                  }`}>
                    {device.status}
                  </p>
                  {device.lastSeen && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(device.lastSeen).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </LayoutWrapper>
  )
}

// ─────────────────────────────────────────────
// STUDENT DASHBOARD
// ─────────────────────────────────────────────
function StudentDashboard() {
  const { user } = useAuth()
  const [tickets, setTickets] = useState<any[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    title: '', description: '', category: 'network', priority: 'medium',
  })

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [ticketRes, sum] = await Promise.all([
          ticketService.getAll(),
          analyticsService.getSummary(),
        ])
        setTickets(ticketRes.tickets || [])
        setSummary(sum)
      } catch (err) {
        console.error('Student dashboard error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await ticketService.create(form)
      setSuccess(true)
      setShowForm(false)
      setForm({ title: '', description: '', category: 'network', priority: 'medium' })
      const res = await ticketService.getAll()
      setTickets(res.tickets || [])
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Ticket creation failed:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const openTickets = tickets.filter(t => t.status === 'open')
  const inProgressTickets = tickets.filter(t => t.status === 'in_progress')
  const resolvedTickets = tickets.filter(t => t.status === 'resolved')

  if (loading) return <DashboardSkeleton />

  return (
    <LayoutWrapper>
      <div className="space-y-8">

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold">
              Hi, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-muted-foreground mt-2">Your campus network portal</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-xs font-medium text-green-500">Student Access</span>
          </div>
        </div>

        {success && (
          <div className="rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-3 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
              Ticket submitted successfully! IT staff will respond soon.
            </p>
          </div>
        )}

        {/* Network status banner */}
        <div className={`rounded-xl border p-5 flex items-center gap-4 ${
          summary?.uptimePercent >= 90
            ? 'border-green-500/30 bg-green-500/5'
            : 'border-yellow-500/30 bg-yellow-500/5'
        }`}>
          <Wifi className={`h-8 w-8 flex-shrink-0 ${
            summary?.uptimePercent >= 90 ? 'text-green-500' : 'text-yellow-500'
          }`} />
          <div>
            <p className="font-semibold">
              Campus Network is{' '}
              {summary?.uptimePercent >= 90 ? 'Operational' : 'Experiencing Issues'}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {summary?.uptimePercent ?? 0}% uptime ·{' '}
              {summary?.onlineDevices ?? 0} of {summary?.totalDevices ?? 0} devices online ·{' '}
              {summary?.unresolvedAlerts ?? 0} active alerts
            </p>
          </div>
        </div>

        {/* Ticket stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">My Open Tickets</p>
            <p className="text-3xl font-bold mt-2">{openTickets.length}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">In Progress</p>
            <p className="text-3xl font-bold mt-2 text-yellow-500">{inProgressTickets.length}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Resolved</p>
            <p className="text-3xl font-bold mt-2 text-green-500">{resolvedTickets.length}</p>
          </div>
        </div>

        {/* Report Issue CTA */}
        {!showForm ? (
          <div className="rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-colors p-8 text-center">
            <Ticket className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-1">Experiencing a network issue?</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Report it to the IT team and track resolution in real time
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-6 py-2.5 font-medium hover:opacity-90 transition-opacity"
            >
              <Plus className="h-4 w-4" />
              Report an Issue
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Report a Network Issue</h2>
              <button type="button" onClick={() => setShowForm(false)}
                className="text-sm text-muted-foreground hover:text-foreground">
                Cancel ✕
              </button>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">What is the issue?</label>
              <input
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                required
                placeholder="e.g. WiFi not working in Lab Block A"
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Describe the issue</label>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                required rows={3}
                placeholder="Provide details — location, when it started, devices affected..."
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="network">Network / WiFi</option>
                  <option value="hardware">Hardware</option>
                  <option value="software">Software / Portal</option>
                  <option value="access">Access / Login</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Priority</label>
                <select
                  value={form.priority}
                  onChange={e => setForm({ ...form, priority: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="low">Low — minor inconvenience</option>
                  <option value="medium">Medium — affecting my work</option>
                  <option value="high">High — blocking completely</option>
                </select>
              </div>
            </div>
            <button
              type="submit" disabled={submitting}
              className="w-full rounded-lg bg-primary text-primary-foreground py-2.5 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Issue Report'}
            </button>
          </form>
        )}

        {/* My Tickets List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">My Tickets</h2>
          {tickets.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-8 text-center">
              <p className="text-muted-foreground">
                No tickets yet. Use the button above to report an issue.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {tickets.map((ticket: any) => (
                <div key={ticket._id} className="rounded-xl border border-border bg-card p-5 flex items-start gap-4">
                  <div className={`h-3 w-3 rounded-full mt-1 flex-shrink-0 ${
                    ticket.status === 'resolved' || ticket.status === 'closed'
                      ? 'bg-green-500'
                      : ticket.status === 'in_progress'
                      ? 'bg-yellow-500'
                      : 'bg-blue-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium">{ticket.title}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 capitalize ${
                        ticket.status === 'resolved' || ticket.status === 'closed'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : ticket.status === 'in_progress'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                      }`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {ticket.description}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                      <span>·</span>
                      <span className="capitalize">{ticket.category}</span>
                      {ticket.assignedTo && (
                        <>
                          <span>·</span>
                          <span>Assigned to {ticket.assignedTo.name}</span>
                        </>
                      )}
                    </div>
                    {ticket.resolution && (
                      <div className="mt-3 rounded-lg bg-green-500/10 border border-green-500/20 px-3 py-2">
                        <p className="text-xs font-medium text-green-600 dark:text-green-400">Resolution:</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{ticket.resolution}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </LayoutWrapper>
  )
}

// ─────────────────────────────────────────────
// LOADING SKELETON
// ─────────────────────────────────────────────
function DashboardSkeleton() {
  return (
    <LayoutWrapper>
      <div className="space-y-8 animate-pulse">
        <div className="h-10 w-64 bg-muted rounded-lg" />
        <div className="grid grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 bg-muted rounded-xl" />
          ))}
        </div>
        <div className="h-72 bg-muted rounded-xl" />
        <div className="grid grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-64 bg-muted rounded-xl" />
          <div className="h-64 bg-muted rounded-xl" />
        </div>
      </div>
    </LayoutWrapper>
  )
}