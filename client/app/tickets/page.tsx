'use client'

import { useEffect, useState } from 'react'
import { LayoutWrapper } from '@/components/layout-wrapper'
import ticketService from '@/lib/services/ticketService'
import { useAuth } from '@/context/AuthContext'
import { useSocket } from '@/context/SocketContext'
import {
  Plus, Filter, Clock, CheckCircle,
  AlertCircle, User, MessageSquare, ChevronDown
} from 'lucide-react'

const priorityConfig: Record<string, { color: string; bg: string }> = {
  critical: { color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30' },
  high:     { color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30' },
  medium:   { color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
  low:      { color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
}

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  open:        { color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30', label: 'Open' },
  in_progress: { color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/30', label: 'In Progress' },
  resolved:    { color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30', label: 'Resolved' },
  closed:      { color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-900/30', label: 'Closed' },
}

export default function TicketsPage() {
  const { user } = useAuth()
  const socket = useSocket()
  const isStaff = user?.role === 'admin' || user?.role === 'it_staff'

  const [tickets, setTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [resolution, setResolution] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    title: '', description: '', category: 'network', priority: 'medium',
  })

  const fetchTickets = async () => {
    try {
      const res = await ticketService.getAll()
      setTickets(res.tickets || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTickets() }, [])

  // Real-time ticket updates
  useEffect(() => {
    if (!socket) return
    socket.on('ticket_updated', (updatedTicket: any) => {
      setTickets(prev =>
        prev.map(t => t._id === updatedTicket._id ? updatedTicket : t)
      )
    })
    socket.on('ticket_created', (newTicket: any) => {
      setTickets(prev => [newTicket, ...prev])
    })
    return () => {
      socket.off('ticket_updated')
      socket.off('ticket_created')
    }
  }, [socket])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await ticketService.create(form)
      setShowForm(false)
      setForm({ title: '', description: '', category: 'network', priority: 'medium' })
      fetchTickets()
    } catch (err) { console.error(err) }
    finally { setSubmitting(false) }
  }

  const handleStatusChange = async (ticketId: string, status: string) => {
    try {
      await ticketService.update(ticketId, { status })
      setTickets(prev =>
        prev.map(t => t._id === ticketId ? { ...t, status } : t)
      )
    } catch (err) { console.error(err) }
  }

  const handleAssignToMe = async (ticketId: string) => {
    try {
      await ticketService.update(ticketId, {
        assignedTo: user?.id,
        status: 'in_progress',
      })
      fetchTickets()
    } catch (err) { console.error(err) }
  }

  const handleResolve = async (ticketId: string) => {
    if (!resolution.trim()) return
    try {
      await ticketService.update(ticketId, {
        status: 'resolved',
        resolution,
      })
      setSelectedTicket(null)
      setResolution('')
      fetchTickets()
    } catch (err) { console.error(err) }
  }

  const filtered = tickets.filter(t => {
    const sMatch = statusFilter === 'all' || t.status === statusFilter
    const pMatch = priorityFilter === 'all' || t.priority === priorityFilter
    const cMatch = categoryFilter === 'all' || t.category === categoryFilter
    return sMatch && pMatch && cMatch
  })

  const stats = {
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    myTickets: tickets.filter(t => t.assignedTo?._id === user?.id).length,
  }

  return (
    <LayoutWrapper>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold">Tickets</h1>
            <p className="text-muted-foreground mt-1">
              {isStaff ? 'Manage and resolve IT support tickets' : 'Your support requests'}
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" />
            New Ticket
          </button>
        </div>

        {/* Create ticket form */}
        {showForm && (
          <form onSubmit={handleCreate} className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h2 className="text-lg font-semibold">Create New Ticket</h2>
            <input
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              required
              placeholder="Issue title"
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              required
              rows={3}
              placeholder="Describe the issue in detail..."
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="network">Network / WiFi</option>
                  <option value="hardware">Hardware</option>
                  <option value="software">Software</option>
                  <option value="access">Access / Login</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Priority</label>
                <select
                  value={form.priority}
                  onChange={e => setForm({ ...form, priority: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={submitting}
                className="rounded-lg bg-primary text-primary-foreground px-5 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50">
                {submitting ? 'Submitting...' : 'Submit Ticket'}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="rounded-lg border border-border px-5 py-2 text-sm font-medium hover:bg-muted">
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Open', value: stats.open, color: 'text-blue-500' },
            { label: 'In Progress', value: stats.inProgress, color: 'text-yellow-500' },
            { label: 'Resolved', value: stats.resolved, color: 'text-green-500' },
            { label: isStaff ? 'Assigned to me' : 'My tickets', value: isStaff ? stats.myTickets : tickets.length, color: 'text-primary' },
          ].map(stat => (
            <div key={stat.label} className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {[
            { value: statusFilter, setter: setStatusFilter, options: [
              { value: 'all', label: 'All Status' },
              { value: 'open', label: 'Open' },
              { value: 'in_progress', label: 'In Progress' },
              { value: 'resolved', label: 'Resolved' },
              { value: 'closed', label: 'Closed' },
            ]},
            { value: priorityFilter, setter: setPriorityFilter, options: [
              { value: 'all', label: 'All Priority' },
              { value: 'critical', label: 'Critical' },
              { value: 'high', label: 'High' },
              { value: 'medium', label: 'Medium' },
              { value: 'low', label: 'Low' },
            ]},
            { value: categoryFilter, setter: setCategoryFilter, options: [
              { value: 'all', label: 'All Category' },
              { value: 'network', label: 'Network' },
              { value: 'hardware', label: 'Hardware' },
              { value: 'software', label: 'Software' },
              { value: 'access', label: 'Access' },
              { value: 'other', label: 'Other' },
            ]},
          ].map((filter, i) => (
            <select
              key={i}
              value={filter.value}
              onChange={e => filter.setter(e.target.value)}
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {filter.options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          ))}
          <span className="text-sm text-muted-foreground ml-auto">
            {filtered.length} ticket{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Resolution modal */}
        {selectedTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="rounded-2xl border border-border bg-card p-6 w-full max-w-md space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Resolve Ticket</h3>
                <button onClick={() => setSelectedTicket(null)} className="text-muted-foreground hover:text-foreground">✕</button>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <p className="text-sm font-medium">{selectedTicket.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{selectedTicket.description}</p>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1.5">Resolution Notes</label>
                <textarea
                  value={resolution}
                  onChange={e => setResolution(e.target.value)}
                  rows={4}
                  placeholder="Describe how the issue was resolved..."
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleResolve(selectedTicket._id)}
                  disabled={!resolution.trim()}
                  className="flex-1 rounded-lg bg-green-600 text-white py-2.5 text-sm font-medium hover:bg-green-500 disabled:opacity-50"
                >
                  Mark Resolved
                </button>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tickets list */}
        {loading ? (
          <p className="text-muted-foreground">Loading tickets...</p>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <CheckCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-30" />
            <p className="text-muted-foreground">No tickets found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((ticket: any) => {
              const pc = priorityConfig[ticket.priority] || priorityConfig.medium
              const sc = statusConfig[ticket.status] || statusConfig.open
              return (
                <div
                  key={ticket._id}
                  className="rounded-xl border border-border bg-card p-5 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start gap-4">

                    {/* Priority dot */}
                    <div className={`h-2.5 w-2.5 rounded-full mt-1.5 flex-shrink-0 ${
                      ticket.priority === 'critical' || ticket.priority === 'high'
                        ? 'bg-destructive'
                        : ticket.priority === 'medium'
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`} />

                    <div className="flex-1 min-w-0">
                      {/* Title + badges */}
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="font-medium">{ticket.title}</h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${pc.bg} ${pc.color}`}>
                            {ticket.priority}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sc.bg} ${sc.color}`}>
                            {sc.label}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {ticket.description}
                      </p>

                      {/* Meta row */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {ticket.raisedBy?.name || 'Unknown'}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </div>
                        <span className="capitalize">{ticket.category}</span>
                        {ticket.assignedTo && (
                          <div className="flex items-center gap-1 text-primary">
                            <CheckCircle className="h-3 w-3" />
                            Assigned to {ticket.assignedTo.name}
                          </div>
                        )}
                      </div>

                      {/* Resolution note if resolved */}
                      {ticket.resolution && (
                        <div className="rounded-lg bg-green-500/10 border border-green-500/20 px-3 py-2 mb-3">
                          <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-0.5">
                            Resolution:
                          </p>
                          <p className="text-xs text-muted-foreground">{ticket.resolution}</p>
                        </div>
                      )}

                      {/* IT Staff action buttons */}
                      {isStaff && ticket.status !== 'resolved' && ticket.status !== 'closed' && (
                        <div className="flex items-center gap-2 flex-wrap">
                          {!ticket.assignedTo && (
                            <button
                              onClick={() => handleAssignToMe(ticket._id)}
                              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium"
                            >
                              <User className="h-3 w-3" />
                              Assign to me
                            </button>
                          )}
                          {ticket.status === 'open' && (
                            <button
                              onClick={() => handleStatusChange(ticket._id, 'in_progress')}
                              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 transition-colors font-medium"
                            >
                              <AlertCircle className="h-3 w-3" />
                              Start working
                            </button>
                          )}
                          {ticket.status === 'in_progress' && (
                            <button
                              onClick={() => setSelectedTicket(ticket)}
                              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors font-medium"
                            >
                              <CheckCircle className="h-3 w-3" />
                              Mark Resolved
                            </button>
                          )}
                          {ticket.status === 'resolved' && (
                            <button
                              onClick={() => handleStatusChange(ticket._id, 'closed')}
                              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors font-medium"
                            >
                              Close Ticket
                            </button>
                          )}

                          {/* Quick status dropdown */}
                          <select
                            value={ticket.status}
                            onChange={e => handleStatusChange(ticket._id, e.target.value)}
                            className="text-xs rounded-lg border border-input bg-background px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-ring"
                          >
                            <option value="open">Open</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </LayoutWrapper>
  )
}