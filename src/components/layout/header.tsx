'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useOrg } from '@/hooks/use-org';
import { useTheme } from '@/components/theme-provider';
import {
  Bell,
  Search,
  User,
  Sun,
  Moon,
  AlertTriangle,
  MessageSquare,
  Clock,
  RefreshCw,
  Check,
  ExternalLink,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface NotificationItem {
  id: string;
  type: 'breach' | 'whatsapp' | 'pm' | 'renewal';
  title: string;
  time: string;
  unread: boolean;
  link: string;
}

const initialNotifications: NotificationItem[] = [
  {
    id: 'n1',
    type: 'breach',
    title: 'SLA Alert: Job #JOB-01042 has exceeded resolution threshold.',
    time: '12m ago',
    unread: true,
    link: '/dashboard',
  },
  {
    id: 'n2',
    type: 'whatsapp',
    title: 'New WhatsApp request registered: Ticket #TKT-01045.',
    time: '34m ago',
    unread: true,
    link: '/dashboard',
  },
  {
    id: 'n3',
    type: 'pm',
    title: 'Overdue PM Visit: Contract #AMC-2026-089 pending dispatch.',
    time: '2h ago',
    unread: true,
    link: '/dashboard',
  },
  {
    id: 'n4',
    type: 'renewal',
    title: 'Contract #AMC-2026-0042 expires in 17 days (Value: ₹1,20,000).',
    time: '5h ago',
    unread: false,
    link: '/renewals',
  },
];

export function Header() {
  const { person, membership } = useOrg();
  const { theme, toggleTheme } = useTheme();

  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Close notification popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'breach':
        return <AlertTriangle className="w-3.5 h-3.5 text-red-500" />;
      case 'whatsapp':
        return <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />;
      case 'pm':
        return <Clock className="w-3.5 h-3.5 text-amber-500" />;
      case 'renewal':
        return <RefreshCw className="w-3.5 h-3.5 text-indigo-500" />;
    }
  };

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 flex items-center justify-between transition-colors z-20">
      {/* Search Input */}
      <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-1.5 w-80 text-sm text-slate-500 dark:text-slate-400">
        <Search className="w-4 h-4 text-slate-400 dark:text-slate-500" />
        <input
          type="text"
          placeholder="Search tickets, jobs, contracts..."
          className="bg-transparent border-none outline-none text-slate-900 dark:text-slate-100 w-full placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Dark / Light Mode Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>

        {/* Interactive Notification Bell */}
        <div className="relative" ref={notificationRef}>
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 rounded-lg transition-colors ${
              showNotifications
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
              </span>
            )}
          </button>

          {/* Notification Dropdown Drawer */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <Badge variant="default" className="text-[10px] px-1.5 py-0 font-semibold">
                      {unreadCount} new
                    </Badge>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" /> Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No active notifications.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer flex items-start gap-3 ${
                        n.unread ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                      }`}
                    >
                      <div className="mt-0.5 w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                        {getIcon(n.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={n.link}
                          onClick={() => setShowNotifications(false)}
                          className="text-xs font-medium text-slate-800 dark:text-slate-200 hover:text-blue-600 block line-clamp-2 leading-relaxed"
                        >
                          {n.title}
                        </Link>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {n.time}
                        </span>
                      </div>
                      {n.unread && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 text-center">
                <Link
                  href="/dashboard"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                >
                  View All Live Alerts <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />

        {/* User Profile Badge */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 flex items-center justify-center font-semibold text-sm">
            <User className="w-4 h-4" />
          </div>
          <div className="text-left text-xs hidden sm:block">
            <div className="font-semibold text-slate-800 dark:text-slate-200">
              {person?.full_name || 'Administrator'}
            </div>
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <Badge variant="secondary" className="px-1.5 py-0 text-[10px] dark:bg-slate-800 dark:text-slate-300">
                {membership.role}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
