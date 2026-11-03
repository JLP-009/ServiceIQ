import React from 'react';
import { FileText } from 'lucide-react';

export default function ContractsPage() {
  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <div className="flex items-center gap-3">
        <FileText className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-slate-900">AMC Contracts</h1>
      </div>
      <p className="text-sm text-slate-500">
        Assigned to Track B (Person 2). Annual maintenance agreements, coverage rules, and automated PM visit generation.
      </p>
      <div className="p-8 border border-dashed border-slate-300 rounded-xl bg-white text-center text-slate-400 text-sm">
        Contract editor, coverage rules matrix, and customer agreements list.
      </div>
    </div>
  );
}
