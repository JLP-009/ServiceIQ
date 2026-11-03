'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarDays,
  Ticket,
  Briefcase,
  Wrench,
  FileText,
  Users,
  Package,
  RefreshCw,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useOrg } from '@/hooks/use-org';

const navItems = [
  { href: '/dashboard', label: 'Owner Dashboard', icon: LayoutDashboard },
  { href: '/dispatch', label: 'Dispatch Board', icon: CalendarDays },
  { href: '/tickets', label: 'Tickets', icon: Ticket },
  { href: '/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/equipment', label: 'Equipment Catalogue', icon: Wrench },
  { href: '/contracts', label: 'AMC Contracts', icon: FileText },
  { href: '/technicians', label: 'Technicians', icon: Users },
  { href: '/parts', label: 'Parts Catalogue', icon: Package },
  { href: '/renewals', label: 'Renewal Pipeline', icon: RefreshCw },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { org, membership } = useOrg();

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col h-screen select-none transition-colors">
      {/* Brand Header */}
      <div className="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center px-6 gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm font-bold">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <div className="font-bold text-slate-900 dark:text-white leading-none">ServiceIQ</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate max-w-[140px]">
            {org?.name || 'Organisation'}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100'
              )}
            >
              <Icon className={cn('w-4 h-4', isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500')} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User profile footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-600 dark:text-slate-400">
            <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">{membership.role}</span> view
          </div>
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 shadow-sm" title="Connected" />
        </div>
      </div>
    </aside>
  );
}
