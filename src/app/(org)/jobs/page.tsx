import React from 'react';
import { Briefcase } from 'lucide-react';

export default function JobsPage() {
  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <div className="flex items-center gap-3">
        <Briefcase className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-slate-900">Field Jobs</h1>
      </div>
      <p className="text-sm text-slate-500">
        Assigned to Track C & D. State machine transitions, parts usage, and SLA tracking.
      </p>
      <div className="p-8 border border-dashed border-slate-300 rounded-xl bg-white text-center text-slate-400 text-sm">
        List of all active and completed field repair jobs.
      </div>
    </div>
  );
}
