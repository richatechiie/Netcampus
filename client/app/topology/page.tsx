'use client'

import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { LayoutWrapper } from '@/components/layout-wrapper'
import { Badge } from '@/components/badge'
import deviceService from '@/lib/services/deviceService'
import { useSocket } from '@/context/SocketContext'

// Color map per device type
const typeConfig: Record<string, { color: string; label: string }> = {
  router:       { color: '#3b82f6', label: 'Router' },
  switch:       { color: '#22c55e', label: 'Switch' },
  access_point: { color: '#a855f7', label: 'Access Point' },
  server:       { color: '#f59e0b', label: 'Server' },
  other:        { color: '#6b7280', label: 'Other' },
}

export default function TopologyPage() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [devices, setDevices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any>(null)
  const socket = useSocket()

  const fetchDevices = async () => {
    try {
      const res = await deviceService.getAll()
      setDevices(res.devices || [])
    } catch (err) {
      console.error('Topology fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDevices()
  }, [])

  // Live status updates via socket
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

  // Build D3 graph whenever devices change
  useEffect(() => {
    if (!svgRef.current || devices.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const width = svgRef.current.clientWidth || 800
    const height = 480

    // Nodes = devices
    const nodes: any[] = devices.map((d) => ({
      id: d._id,
      name: d.name,
      type: d.type,
      status: d.status,
      ip: d.ipAddress,
      location: d.location,
    }))

    // Edges = connect devices in same zone/location (simple heuristic)
    // In production you would store explicit connections in DB
    const links: any[] = []
    for (let i = 0; i < nodes.length - 1; i++) {
      links.push({ source: nodes[i].id, target: nodes[i + 1].id })
    }

    const simulation = d3
      .forceSimulation(nodes)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(120))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(50))

    const g = svg.append('g')

    // Zoom + pan
    svg.call(
      d3.zoom<SVGSVGElement, unknown>().on('zoom', (event) => {
        g.attr('transform', event.transform)
      })
    )

    // Draw links
    const link = g
      .append('g')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', '#374151')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', (d: any) => {
        const src = nodes.find((n) => n.id === d.source || n.id === d.source?.id)
        const tgt = nodes.find((n) => n.id === d.target || n.id === d.target?.id)
        return src?.status === 'offline' || tgt?.status === 'offline'
          ? '4 4'
          : 'none'
      })

    // Node groups
    const node = g
      .append('g')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .style('cursor', 'pointer')
      .on('click', (_event: any, d: any) => {
        setSelected(d)
      })
      .call(
        d3
          .drag<SVGGElement, any>()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart()
            d.fx = d.x
            d.fy = d.y
          })
          .on('drag', (event, d) => {
            d.fx = event.x
            d.fy = event.y
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0)
            d.fx = null
            d.fy = null
          })
      )

    // Outer ring — shows online/offline
    node
      .append('circle')
      .attr('r', 28)
      .attr('fill', 'none')
      .attr('stroke', (d: any) =>
        d.status === 'online'
          ? '#22c55e'
          : d.status === 'degraded'
          ? '#f59e0b'
          : '#ef4444'
      )
      .attr('stroke-width', 2)
      .attr('opacity', 0.6)

    // Inner filled circle — shows device type color
    node
      .append('circle')
      .attr('r', 22)
      .attr('fill', (d: any) => typeConfig[d.type]?.color || '#6b7280')
      .attr('opacity', (d: any) => (d.status === 'offline' ? 0.4 : 1))

    // Device type initial letter
    node
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('fill', 'white')
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .attr('pointer-events', 'none')
      .text((d: any) => d.type.charAt(0).toUpperCase())

    // Device name label below node
    node
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('y', 38)
      .attr('fill', '#9ca3af')
      .attr('font-size', '10px')
      .attr('pointer-events', 'none')
      .text((d: any) =>
        d.name.length > 14 ? d.name.slice(0, 12) + '…' : d.name
      )

    // Tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y)

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`)
    })

    return () => {
      simulation.stop()
    }
  }, [devices])

  const onlineCount = devices.filter((d) => d.status === 'online').length
  const offlineCount = devices.filter((d) => d.status === 'offline').length

  return (
    <LayoutWrapper>
      <div className="space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold">Network Topology</h1>
          <p className="text-muted-foreground mt-2">
            Live visualisation of your campus network infrastructure
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total Nodes</p>
            <p className="text-2xl font-bold mt-2">{devices.length}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Online</p>
            <p className="text-2xl font-bold mt-2 text-green-500">{onlineCount}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Offline</p>
            <p className="text-2xl font-bold mt-2 text-destructive">{offlineCount}</p>
          </div>
        </div>

        {/* Legend */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex flex-wrap gap-6">
            {Object.entries(typeConfig).map(([type, cfg]) => (
              <div key={type} className="flex items-center gap-2">
                <div
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: cfg.color }}
                />
                <span className="text-sm">{cfg.label}</span>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full border-2 border-green-500" />
              <span className="text-sm">Online</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full border-2 border-red-500" />
              <span className="text-sm">Offline</span>
            </div>
          </div>
        </div>

        {/* D3 Graph */}
        <div className="rounded-xl border border-border bg-card p-4 relative">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted-foreground">
              Drag nodes to rearrange — scroll to zoom
            </p>
            {selected && (
              <button
                onClick={() => setSelected(null)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Close panel ✕
              </button>
            )}
          </div>

          <div className="flex gap-4">
            {/* SVG canvas */}
            <div className="flex-1">
              {loading ? (
                <div className="h-[480px] flex items-center justify-center">
                  <p className="text-muted-foreground">Loading topology...</p>
                </div>
              ) : devices.length === 0 ? (
                <div className="h-[480px] flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-muted-foreground">No devices found</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Add devices on the Devices page first
                    </p>
                  </div>
                </div>
              ) : (
                <svg
                  ref={svgRef}
                  width="100%"
                  height="480"
                  className="rounded-lg bg-muted/20"
                />
              )}
            </div>

            {/* Selected node detail panel */}
            {selected && (
              <div className="w-56 rounded-lg border border-border bg-card p-4 space-y-3 flex-shrink-0">
                <h3 className="font-semibold text-sm">{selected.name}</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-medium capitalize">
                      {selected.type.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span
                      className={`font-medium capitalize ${
                        selected.status === 'online'
                          ? 'text-green-500'
                          : 'text-destructive'
                      }`}
                    >
                      {selected.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IP</span>
                    <span className="font-medium font-mono">{selected.ip}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location</span>
                    <span className="font-medium">{selected.location}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Nodes List */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold">Network Nodes</h2>
            <p className="text-muted-foreground text-sm mt-1">
              All registered devices
            </p>
          </div>

          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {devices.map((device: any) => (
                <div
                  key={device._id}
                  className="rounded-lg border border-border bg-card p-4 flex items-start gap-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() =>
                    setSelected({
                      id: device._id,
                      name: device.name,
                      type: device.type,
                      status: device.status,
                      ip: device.ipAddress,
                      location: device.location,
                    })
                  }
                >
                  <div
                    className="h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: typeConfig[device.type]?.color || '#6b7280',
                      opacity: device.status === 'offline' ? 0.5 : 1,
                    }}
                  >
                    <span className="text-white text-sm font-semibold">
                      {device.type.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{device.name}</h3>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">
                      {device.ipAddress}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant={
                          device.status === 'online'
                            ? 'success'
                            : device.status === 'degraded'
                            ? 'info'
                            : 'error'
                        }
                        label={
                          device.status.charAt(0).toUpperCase() +
                          device.status.slice(1)
                        }
                      />
                      <span className="text-xs text-muted-foreground">
                        {device.location}
                      </span>
                    </div>
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