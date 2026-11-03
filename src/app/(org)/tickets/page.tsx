import React from 'react';
import { Ticket } from 'lucide-react';

export default function TicketsPage() {
  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <div className="flex items-center gap-3">
        <Ticket className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-slate-900">Tickets Management</h1>
      </div>
      <p className="text-sm text-slate-500">
        Assigned to Track C (Person 3). Inbound customer complaints from phone, portal, and WhatsApp.
      </p>
      <div className="p-8 border border-dashed border-slate-300 rounded-xl bg-white text-center text-slate-400 text-sm">
        Ticket intake list & SLA countdown timers.
      </div>
    </div>
  );
}
