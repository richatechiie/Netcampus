'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface ChartData {
  time: string
  devices?: number
  alerts?: number
  traffic?: number
}

interface UptimeChartProps {
  data: ChartData[]
  title?: string
  height?: number
}

export function UptimeChart({ data, title = 'Network Activity', height = 300 }: UptimeChartProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
          <YAxis stroke="hsl(var(--muted-foreground))" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
            cursor={false}
          />
          <Legend />
          {data[0]?.devices && <Line type="monotone" dataKey="devices" stroke="hsl(var(--chart-1))" />}
          {data[0]?.alerts && <Line type="monotone" dataKey="alerts" stroke="hsl(var(--chart-2))" />}
          {data[0]?.traffic && <Line type="monotone" dataKey="traffic" stroke="hsl(var(--chart-3))" />}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
