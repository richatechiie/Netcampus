import { Badge } from './badge'

interface Device {
  id: string
  name: string
  type: string
  status: string
  uptime: string
  cpu: number
  memory: number
  location: string
  ip: string
}

interface DeviceTableProps {
  devices: Device[]
}

export function DeviceTable({ devices }: DeviceTableProps) {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted">
            <th className="px-6 py-4 text-left text-sm font-semibold">Device Name</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Type</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Uptime</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">CPU</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Memory</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Location</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">IP Address</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((device) => (
            <tr key={device.id} className="border-b border-border hover:bg-muted/50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium">{device.name}</td>
              <td className="px-6 py-4 text-sm text-muted-foreground">{device.type}</td>
              <td className="px-6 py-4 text-sm">
                <Badge
                  variant={device.status === 'online' ? 'success' : 'error'}
                  label={device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                />
              </td>
              <td className="px-6 py-4 text-sm text-muted-foreground">{device.uptime}</td>
              <td className="px-6 py-4 text-sm">{device.cpu}%</td>
              <td className="px-6 py-4 text-sm">{device.memory}%</td>
              <td className="px-6 py-4 text-sm text-muted-foreground">{device.location}</td>
              <td className="px-6 py-4 text-sm font-mono text-muted-foreground">{device.ip}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
