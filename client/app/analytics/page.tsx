'use client';

import { useEffect, useState } from 'react';
import { LayoutWrapper } from '@/components/layout-wrapper';
import { UptimeChart } from '@/components/uptime-chart';
import analyticsService from '@/lib/services/analyticsService';

export default function AnalyticsPage() {
  const [summary, setSummary] = useState<any>(null);
  const [alertsByDay, setAlertsByDay] = useState<any[]>([]);
  const [ticketStats, setTicketStats] = useState<any[]>([]);
  const [deviceUptime, setDeviceUptime] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [sum, alerts, tickets, uptime] = await Promise.all([
          analyticsService.getSummary(),
          analyticsService.getAlertsByDay(),
          analyticsService.getTicketStats(),
          analyticsService.getDeviceUptime(),
        ]);
        setSummary(sum);
        setAlertsByDay(alerts.data || []);
        setTicketStats(tickets.data || []);
        setDeviceUptime(uptime.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <LayoutWrapper>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Network performance insights
          </p>
        </div>

        {/* Summary cards */}
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">Total Devices</p>
              <p className="text-2xl font-bold mt-2">{summary.totalDevices}</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">Uptime</p>
              <p className="text-2xl font-bold mt-2">{summary.uptimePercent}%</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">Open Tickets</p>
              <p className="text-2xl font-bold mt-2">{summary.openTickets}</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">Unresolved Alerts</p>
              <p className="text-2xl font-bold mt-2">{summary.unresolvedAlerts}</p>
            </div>
          </div>
        )}

        {/* Alerts by day chart */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Alerts — last 7 days</h2>
          <UptimeChart
            data={alertsByDay.map((d: any) => ({ time: d._id, alerts: d.count }))}
            title=""
            height={250}
          />
        </div>

        {/* Ticket status breakdown */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Ticket status breakdown</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ticketStats.map((s: any) => (
              <div key={s._id} className="rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground capitalize">{s._id.replace('_', ' ')}</p>
                <p className="text-2xl font-bold mt-1">{s.count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Device uptime table */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Device uptime (last 24h)</h2>
          <div className="space-y-3">
            {deviceUptime.map((d: any) => (
              <div key={d.ipAddress} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{d.deviceName}</p>
                  <p className="text-xs text-muted-foreground">{d.ipAddress}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${d.uptimePercent}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-12 text-right">
                    {d.uptimePercent}%
                  </span>
                </div>
              </div>
            ))}
            {deviceUptime.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No data yet — uptime data appears after 30 seconds of monitoring
              </p>
            )}
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}