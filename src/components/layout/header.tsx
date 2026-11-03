'use client';

import React from 'react';
import { useOrg } from '@/hooks/use-org';
import { Bell, Search, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function Header() {
  const { person, membership } = useOrg();

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between">
      {/* Global search stub */}
      <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-1.5 w-80 text-sm text-slate-500">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search tickets, jobs, serial numbers..."
          className="bg-transparent border-none outline-none text-slate-900 w-full placeholder:text-slate-400 text-sm"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600" />
        </button>

        <div className="h-6 w-px bg-slate-200" />

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm">
            <User className="w-4 h-4" />
          </div>
          <div className="text-left text-xs">
            <div className="font-semibold text-slate-800">{person?.full_name || 'Logged In User'}</div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">
                {membership.role}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
