import { LayoutWrapper } from '@/components/layout-wrapper'
import { topologyData } from '@/lib/data/dummy-data'
import { Badge } from '@/components/badge'
import { Network } from 'lucide-react'

export default function TopologyPage() {
  return (
    <LayoutWrapper>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold">Network Topology</h1>
          <p className="text-muted-foreground mt-2">Visualize your network infrastructure connections</p>
        </div>

        {/* Legend */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-blue-500" />
              <span className="text-sm">Router</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-green-500" />
              <span className="text-sm">Switch</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-red-500" />
              <span className="text-sm">Firewall</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-purple-500" />
              <span className="text-sm">Access Point</span>
            </div>
          </div>
        </div>

        {/* Topology Diagram */}
        <div className="rounded-xl border border-border bg-card p-8 min-h-96 flex items-center justify-center">
          <div className="text-center">
            <Network className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Interactive topology visualization coming soon
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              In production, this would render using a network topology library
            </p>
          </div>
        </div>

        {/* Nodes List */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold">Network Nodes</h2>
            <p className="text-muted-foreground text-sm mt-1">List of all network elements</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {topologyData.nodes.map((node) => {
              const typeColorMap: Record<string, { color: string; bgColor: string }> = {
                router: { color: 'blue', bgColor: 'bg-blue-100 dark:bg-blue-900' },
                switch: { color: 'green', bgColor: 'bg-green-100 dark:bg-green-900' },
                firewall: { color: 'red', bgColor: 'bg-red-100 dark:bg-red-900' },
                ap: { color: 'purple', bgColor: 'bg-purple-100 dark:bg-purple-900' },
                external: { color: 'gray', bgColor: 'bg-gray-100 dark:bg-gray-900' },
              }

              const typeColor = typeColorMap[node.type] || typeColorMap.external

              return (
                <div
                  key={node.id}
                  className="rounded-lg border border-border bg-card p-4 flex items-start gap-4"
                >
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${typeColor.bgColor}`}
                  >
                    <span className="text-sm font-semibold">{node.id}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{node.label}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant={node.type === 'external' ? 'info' : node.status === 'online' ? 'success' : 'error'}
                        label={node.type.charAt(0).toUpperCase() + node.type.slice(1)}
                      />
                      {node.status && (
                        <Badge
                          variant={node.status === 'online' ? 'success' : 'error'}
                          label={node.status.charAt(0).toUpperCase() + node.status.slice(1)}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Connections List */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold">Network Connections</h2>
            <p className="text-muted-foreground text-sm mt-1">{topologyData.edges.length} active connections</p>
          </div>

          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted">
                  <th className="px-6 py-4 text-left text-sm font-semibold">From Node</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">To Node</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Connection Status</th>
                </tr>
              </thead>
              <tbody>
                {topologyData.edges.map((edge, idx) => {
                  const fromNode = topologyData.nodes.find((n) => n.id === edge.from)
                  const toNode = topologyData.nodes.find((n) => n.id === edge.to)

                  const isHealthy =
                    fromNode?.status !== 'offline' && toNode?.status !== 'offline'

                  return (
                    <tr
                      key={idx}
                      className="border-b border-border hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium">{fromNode?.label}</td>
                      <td className="px-6 py-4 text-sm font-medium">{toNode?.label}</td>
                      <td className="px-6 py-4 text-sm">
                        <Badge
                          variant={isHealthy ? 'success' : 'error'}
                          label={isHealthy ? 'Active' : 'Degraded'}
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}
