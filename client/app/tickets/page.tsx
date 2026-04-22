'use client';

import { useEffect, useState } from 'react';
import { LayoutWrapper } from '@/components/layout-wrapper';
import { TicketTable } from '@/components/ticket-table';
import ticketService from '@/lib/services/ticketService';
import { Plus, Filter } from 'lucide-react';

export default function TicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', category: 'network', priority: 'medium',
  });

  const fetchTickets = async () => {
    try {
      const res = await ticketService.getAll();
      setTickets(res.tickets || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTickets(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ticketService.create(form);
      setShowForm(false);
      setForm({ title: '', description: '', category: 'network', priority: 'medium' });
      fetchTickets();
    } catch (err) {
      console.error(err);
    }
  };

  const formatted = tickets.map((t: any) => ({
    id: t._id,
    title: t.title,
    priority: t.priority,
    status: t.status.replace('_', '-'),
    assigned: t.assignedTo?.name || 'Unassigned',
    created: new Date(t.createdAt).toLocaleDateString(),
  }));

  const filtered = formatted.filter((t) => {
    const pMatch = priorityFilter === 'all' || t.priority === priorityFilter;
    const sMatch = statusFilter === 'all' || t.status === statusFilter;
    return pMatch && sMatch;
  });

  const stats = {
    open: formatted.filter((t) => t.status === 'open').length,
    inProgress: formatted.filter((t) => t.status === 'in-progress').length,
    closed: formatted.filter((t) => t.status === 'closed').length,
  };

  return (
    <LayoutWrapper>
      <div className="space-y-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold">Tickets</h1>
            <p className="text-muted-foreground mt-2">Track and manage support tickets</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" />
            New Ticket
          </button>
        </div>

        {/* New Ticket Form */}
        {showForm && (
          <form
            onSubmit={handleCreate}
            className="rounded-xl border border-border bg-card p-6 space-y-4"
          >
            <h2 className="text-lg font-semibold">Create New Ticket</h2>
            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              rows={3}
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <div className="flex gap-4">
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="network">Network</option>
                <option value="hardware">Hardware</option>
                <option value="software">Software</option>
                <option value="access">Access</option>
                <option value="other">Other</option>
              </select>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90"
              >
                Submit Ticket
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

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

        <div className="flex gap-4 items-center">
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

        {loading ? (
          <p className="text-muted-foreground">Loading tickets...</p>
        ) : (
          <TicketTable tickets={filtered} />
        )}
      </div>
    </LayoutWrapper>
  );
}