import React from 'react';
import { CalendarDays } from 'lucide-react';

export default function DispatchPage() {
  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <div className="flex items-center gap-3">
        <CalendarDays className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-slate-900">Dispatch Board</h1>
      </div>
      <p className="text-sm text-slate-500">
        Assigned to Track C (Person 3). Technicians schedule timeline & unassigned queue will appear here.
      </p>
      <div className="p-8 border border-dashed border-slate-300 rounded-xl bg-white text-center text-slate-400 text-sm">
        Dispatch board calendar & drag-and-drop slots interface.
      </div>
    </div>
  );
}
