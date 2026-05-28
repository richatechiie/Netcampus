'use client'

import { useEffect, useRef, useState } from 'react'
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
import { useSocket } from '@/context/SocketContext'
import deviceService from '@/lib/services/deviceService'

const MAX_POINTS = 20 // show last 20 data points per device
const COLORS = [
    '#3b82f6',
    '#22c55e',
    '#f59e0b',
    '#a855f7',
    '#ef4444',
    '#06b6d4',
    '#ec4899',
    '#84cc16',
]

interface DataPoint {
    time: string
    [deviceName: string]: number | string
}

export function LatencyGraph() {
    const socket = useSocket()
    const [devices, setDevices] = useState<any[]>([])
    const [data, setData] = useState<DataPoint[]>([])
    const [selectedDevices, setSelectedDevices] = useState<string[]>([])
    const [loading, setLoading] = useState(true)
    const dataRef = useRef<DataPoint[]>([])

    // Fetch devices on mount
    useEffect(() => {
        const fetchDevices = async () => {
            try {
                const res = await deviceService.getAll()
                const devs = res.devices || []
                setDevices(devs)
                // Select first 4 devices by default
                setSelectedDevices(devs.slice(0, 4).map((d: any) => d.name))
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchDevices()
    }, [])

    // Listen to live latency updates from socket
    useEffect(() => {
        if (!socket) return

        socket.on('latency_update', (update: any) => {
            const { deviceName, latencyMs, timestamp, status } = update

            const timeLabel = new Date(timestamp).toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            })

            // Update the data array
            const currentData = [...dataRef.current]
            const lastPoint = currentData[currentData.length - 1]

            // Find if we already have a point at this timestamp
            if (lastPoint && lastPoint.time === timeLabel) {
                lastPoint[deviceName] = status === 'offline' ? 0 : latencyMs
                dataRef.current = currentData
            } else {
                // Create new time point
                const newPoint: DataPoint = { time: timeLabel }
                newPoint[deviceName] = status === 'offline' ? 0 : latencyMs
                currentData.push(newPoint)

                // Keep only last MAX_POINTS
                if (currentData.length > MAX_POINTS) {
                    currentData.shift()
                }
                dataRef.current = currentData
            }

            setData([...dataRef.current])
        })

        return () => {
            socket.off('latency_update')
        }
    }, [socket])

    const toggleDevice = (deviceName: string) => {
        setSelectedDevices((prev) =>
            prev.includes(deviceName)
                ? prev.filter((d) => d !== deviceName)
                : [...prev, deviceName]
        )
    }

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (!active || !payload?.length) return null
        return (
            <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
                <p className="text-xs font-medium text-muted-foreground mb-2">
                    {label}
                </p>
                {payload.map((entry: any) => (
                    <div key={entry.name} className="flex items-center gap-2 text-xs">
                        <div
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-muted-foreground">{entry.name}:</span>
                        <span className="font-medium">
                            {entry.value === 0 ? (
                                <span className="text-destructive">Offline</span>
                            ) : (
                                `${entry.value} ms`
                            )}
                        </span>
                    </div>
                ))}
            </div>
        )
    }

    if (loading) {
        return (
            <div className="rounded-xl border border-border bg-card p-6">
                <p className="text-muted-foreground text-sm">
                    Loading latency graph...
                </p>
            </div>
        )
    }

    if (devices.length === 0) {
        return (
            <div className="rounded-xl border border-border bg-card p-6">
                <p className="text-muted-foreground text-sm">
                    No devices found. Add devices to see latency data.
                </p>
            </div>
        )
    }

    return (
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">

            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Live Latency Monitor</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Real-time ping latency — updates every 30 seconds
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                    </span>
                    <span className="text-xs text-muted-foreground">Live</span>
                </div>
            </div>

            {/* Device filter toggles */}
            <div className="flex flex-wrap gap-2">
                {devices.map((device: any, idx: number) => {
                    const isSelected = selectedDevices.includes(device.name)
                    const color = COLORS[idx % COLORS.length]
                    return (
                        <button
                            key={device._id}
                            onClick={() => toggleDevice(device.name)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${isSelected
                                    ? 'border-transparent text-white'
                                    : 'border-border text-muted-foreground bg-transparent'
                                }`}
                            style={
                                isSelected
                                    ? { backgroundColor: color, borderColor: color }
                                    : {}
                            }
                        >
                            <span
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: color }}
                            />
                            {device.name}
                            {device.status === 'offline' && (
                                <span className="ml-1 opacity-70">(offline)</span>
                            )}
                        </button>
                    )
                })}
            </div>

            {/* Chart */}
            {data.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center gap-2">
                    <div className="flex gap-1">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="w-1 bg-primary rounded-full animate-pulse"
                                style={{
                                    height: `${20 + i * 10}px`,
                                    animationDelay: `${i * 0.15}s`,
                                }}
                            />
                        ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Waiting for first ping cycle...
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Data will appear within 30 seconds
                    </p>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={280}>
                    <LineChart
                        data={data}
                        margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="currentColor"
                            className="text-border opacity-30"
                        />
                        <XAxis
                            dataKey="time"
                            tick={{ fontSize: 10, fill: 'currentColor' }}
                            className="text-muted-foreground"
                            interval="preserveStartEnd"
                        />
                        <YAxis
                            tick={{ fontSize: 10, fill: 'currentColor' }}
                            className="text-muted-foreground"
                            label={{
                                value: 'ms',
                                angle: -90,
                                position: 'insideLeft',
                                style: { fontSize: 10 },
                            }}
                            domain={[0, 'dataMax + 10']}  // ← change this line
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            wrapperStyle={{ fontSize: '11px' }}
                            formatter={(value) => (
                                <span className="text-muted-foreground">{value}</span>
                            )}
                        />
                        {devices
                            .filter((d: any) => selectedDevices.includes(d.name))
                            .map((device: any, idx: number) => (
                                <Line
                                    key={device._id}
                                    type="monotone"
                                    dataKey={device.name}
                                    stroke={COLORS[devices.indexOf(device) % COLORS.length]}
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 4 }}
                                    connectNulls={false}
                                    animationDuration={300}
                                />
                            ))}
                    </LineChart>
                </ResponsiveContainer>
            )}

            {/* Stats row */}
            {data.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-border">
                    {devices
                        .filter((d: any) => selectedDevices.includes(d.name))
                        .slice(0, 4)
                        .map((device: any, idx: number) => {
                            const deviceData = data
                                .map((point) => point[device.name] as number)
                                .filter((v) => v && v > 0)

                            const avg =
                                deviceData.length > 0
                                    ? Math.round(
                                        deviceData.reduce((a, b) => a + b, 0) / deviceData.length
                                    )
                                    : null

                            const min =
                                deviceData.length > 0 ? Math.min(...deviceData) : null
                            const max =
                                deviceData.length > 0 ? Math.max(...deviceData) : null

                            return (
                                <div
                                    key={device._id}
                                    className="rounded-lg bg-muted/50 p-3 space-y-1"
                                >
                                    <div className="flex items-center gap-1.5">
                                        <div
                                            className="h-2 w-2 rounded-full flex-shrink-0"
                                            style={{
                                                backgroundColor:
                                                    COLORS[devices.indexOf(device) % COLORS.length],
                                            }}
                                        />
                                        <p className="text-xs font-medium truncate">{device.name}</p>
                                    </div>
                                    {avg !== null ? (
                                        <div className="space-y-0.5">
                                            <p className="text-lg font-bold">{avg}ms</p>
                                            <p className="text-xs text-muted-foreground">
                                                min {min}ms · max {max}ms
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-destructive font-medium">
                                            Offline
                                        </p>
                                    )}
                                </div>
                            )
                        })}
                </div>
            )}
        </div>
    )
}