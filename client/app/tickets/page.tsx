'use client'

import { useState } from 'react'
import { LayoutWrapper } from '@/components/layout-wrapper'
import { TicketTable } from '@/components/ticket-table'
import { ticketData } from '@/lib/data/dummy-data'
import { Filter, Plus } from 'lucide-react'

export default function TicketsPage() {
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredTickets = ticketData.filter((ticket) => {
    const priorityMatch = priorityFilter === 'all' || ticket.priority === priorityFilter
    const statusMatch = statusFilter === 'all' || ticket.status === statusFilter
    return priorityMatch && statusMatch
  })

  const stats = {
    open: ticketData.filter((t) => t.status === 'open').length,
    inProgress: ticketData.filter((t) => t.status === 'in-progress').length,
    closed: ticketData.filter((t) => t.status === 'closed').length,
  }

  return (
    <LayoutWrapper>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold">Tickets</h1>
            <p className="text-muted-foreground mt-2">Track and manage support tickets</p>
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 font-medium hover:opacity-90 transition-opacity">
            <Plus className="h-4 w-4" />
            New Ticket
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Open</p>
            <p className="text-2xl font-bold mt-2">{stats.open}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">In Progress</p>
            <p className="text-2xl font-bold mt-2">{stats.inProgress}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Closed</p>
            <p className="text-2xl font-bold mt-2">{stats.closed}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Priority Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">
              {filteredTickets.length} Ticket{filteredTickets.length !== 1 ? 's' : ''}
            </h2>
          </div>
          <TicketTable tickets={filteredTickets} />
        </div>
      </div>
    </LayoutWrapper>
  )
}
