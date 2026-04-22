'use client';

import { useEffect, useState } from 'react';
import { LayoutWrapper } from '@/components/layout-wrapper';
import { StatCard } from '@/components/stat-card';
import { AlertList } from '@/components/alert-list';
import { UptimeChart } from '@/components/uptime-chart';
import { DeviceTable } from '@/components/device-table';
import analyticsService from '@/lib/services/analyticsService';
import alertService from '@/lib/services/alertService';
import deviceService from '@/lib/services/deviceService';

export default function DashboardPage() {
  const [summary, setSummary] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [sum, alertRes, deviceRes, alertsByDay] = await Promise.all([
          analyticsService.getSummary(),
          alertService.getAll({ limit: 5 }),
          deviceService.getAll(),
          analyticsService.getAlertsByDay(),
        ]);
        setSummary(sum);
        setAlerts(alertRes.alerts || []);
        setDevices(deviceRes.devices || []);
        setChartData(alertsByDay.data || []);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const stats = summary
    ? [
        { label: 'Total Devices', value: String(summary.totalDevices), change: '', trend: 'up' as const },
        { label: 'Online Devices', value: String(summary.onlineDevices), change: `${summary.uptimePercent}%`, trend: 'up' as const },
        { label: 'Active Alerts', value: String(summary.unresolvedAlerts), change: '', trend: 'down' as const },
        { label: 'Open Tickets', value: String(summary.openTickets), change: '', trend: 'down' as const },
      ]
    : [];

  if (loading) {
    return (
      <LayoutWrapper>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Monitor your network infrastructure in real-time
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <UptimeChart
              data={chartData.map((d: any) => ({
                time: d._id,
                alerts: d.count,
              }))}
              title="Alerts per day (last 7 days)"
              height={300}
            />
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Alerts</h3>
            <AlertList alerts={alerts.map((a: any) => ({
              id: a._id,
              device: a.device?.name || 'Unknown',
              type: a.type,
              severity: a.severity,
              time: new Date(a.createdAt).toLocaleString(),
              status: a.acknowledged ? 'acknowledged' : 'unresolved',
            }))} limit={5} />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold">Network Devices</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Overview of all connected devices
            </p>
          </div>
          <DeviceTable devices={devices.map((d: any) => ({
            id: d._id,
            name: d.name,
            type: d.type,
            status: d.status,
            uptime: '-',
            cpu: 0,
            memory: 0,
            location: d.location,
            ip: d.ipAddress,
          }))} />
        </div>
      </div>
    </LayoutWrapper>
  );
}