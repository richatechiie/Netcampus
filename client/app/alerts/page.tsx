'use client';

import { useEffect, useState } from 'react';
import { LayoutWrapper } from '@/components/layout-wrapper';
import { AlertList } from '@/components/alert-list';
import alertService from '@/lib/services/alertService';
import { useSocket } from '@/context/SocketContext';
import { Filter, Trash2 } from 'lucide-react';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const socket = useSocket();

  const fetchAlerts = async () => {
    try {
      const res = await alertService.getAll();
      setAlerts(res.alerts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  // Real-time: add new alert instantly when socket event fires
  useEffect(() => {
    if (!socket) return;
    socket.on('alert', (newAlert: any) => {
      setAlerts((prev) => [newAlert, ...prev]);
    });
    return () => { socket.off('alert'); };
  }, [socket]);

  const formatted = alerts.map((a: any) => ({
    id: a._id || a.alertId,
    device: a.device?.name || a.deviceName || 'Unknown',
    type: a.type,
    severity: a.severity,
    time: a.createdAt
      ? new Date(a.createdAt).toLocaleString()
      : 'just now',
    status: a.acknowledged ? 'acknowledged' : 'unresolved',
  }));

  const filtered = formatted.filter((a) => {
    const sevMatch = severityFilter === 'all' || a.severity === severityFilter;
    const statMatch = statusFilter === 'all' || a.status === statusFilter;
    return sevMatch && statMatch;
  });

  const stats = {
    critical: formatted.filter((a) => a.severity === 'critical').length,
    warning: formatted.filter((a) => a.severity === 'warning').length,
    unresolved: formatted.filter((a) => a.status === 'unresolved').length,
  };

  return (
    <LayoutWrapper>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Alerts</h1>
          <p className="text-muted-foreground mt-2">
            Monitor and manage network alerts
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Critical</p>
            <p className="text-2xl font-bold mt-2 text-destructive">{stats.critical}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Warning</p>
            <p className="text-2xl font-bold mt-2 text-yellow-600">{stats.warning}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Unresolved</p>
            <p className="text-2xl font-bold mt-2">{stats.unresolved}</p>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Severity</option>
            <option value="critical">Critical</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Status</option>
            <option value="unresolved">Unresolved</option>
            <option value="acknowledged">Acknowledged</option>
          </select>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading alerts...</p>
        ) : (
          <AlertList alerts={filtered} />
        )}
      </div>
    </LayoutWrapper>
  );
}