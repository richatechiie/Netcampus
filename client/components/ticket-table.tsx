import { Badge } from './badge'

interface Ticket {
  id: string
  title: string
  priority: string
  status: string
  assigned: string
  created: string
}

interface TicketTableProps {
  tickets: Ticket[]
}

export function TicketTable({ tickets }: TicketTableProps) {
  const priorityVariant = (priority: string): 'error' | 'warning' | 'info' => {
    switch (priority) {
      case 'high':
        return 'error'
      case 'medium':
        return 'warning'
      default:
        return 'info'
    }
  }

  const statusVariant = (status: string): 'success' | 'info' | 'warning' => {
    switch (status) {
      case 'closed':
        return 'success'
      case 'in-progress':
        return 'warning'
      default:
        return 'info'
    }
  }

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted">
            <th className="px-6 py-4 text-left text-sm font-semibold">Ticket ID</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Title</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Priority</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Assigned To</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Created</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id} className="border-b border-border hover:bg-muted/50 transition-colors">
              <td className="px-6 py-4 text-sm font-mono font-semibold">{ticket.id}</td>
              <td className="px-6 py-4 text-sm">{ticket.title}</td>
              <td className="px-6 py-4 text-sm">
                <Badge
                  variant={priorityVariant(ticket.priority)}
                  label={ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                />
              </td>
              <td className="px-6 py-4 text-sm">
                <Badge
                  variant={statusVariant(ticket.status)}
                  label={ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                />
              </td>
              <td className="px-6 py-4 text-sm text-muted-foreground">{ticket.assigned}</td>
              <td className="px-6 py-4 text-sm text-muted-foreground">{ticket.created}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
