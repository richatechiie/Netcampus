'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard, Cpu, AlertCircle, Ticket,
  Network, BarChart3, Users, LogOut,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['admin', 'it_staff', 'student'] },
  { href: '/devices', icon: Cpu, label: 'Devices', roles: ['admin', 'it_staff'] },
  { href: '/alerts', icon: AlertCircle, label: 'Alerts', roles: ['admin', 'it_staff'] },
  { href: '/tickets', icon: Ticket, label: 'Tickets', roles: ['admin', 'it_staff', 'student'] },
  { href: '/topology', icon: Network, label: 'Topology', roles: ['admin', 'it_staff'] },
  { href: '/analytics', icon: BarChart3, label: 'Analytics', roles: ['admin', 'it_staff'] },
  { href: '/users', icon: Users, label: 'Users', roles: ['admin'] },
];

const roleLabel: Record<string, string> = {
  admin: 'Administrator',
  it_staff: 'IT Staff',
  student: 'Student',
};

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const visibleItems = navItems.filter(
    (item) => user && item.roles.includes(user.role)
  );

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-border bg-card p-6 flex flex-col">

      {/* Logo */}
      <div className="mb-12 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <Network className="h-6 w-6 text-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <h1 className="font-bold text-lg">NetCampus</h1>
          <p className="text-xs text-muted-foreground">
            {user ? roleLabel[user.role] : 'Loading...'}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-border pt-4 space-y-3">
        {user && (
          <div className="px-4 py-2">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}