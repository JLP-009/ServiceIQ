import React from 'react';
import { Wrench } from 'lucide-react';

export default function EquipmentPage() {
  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <div className="flex items-center gap-3">
        <Wrench className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-slate-900">Equipment Catalogue</h1>
      </div>
      <p className="text-sm text-slate-500">
        Assigned to Track B (Person 2). Equipment hierarchy, product models, serial numbers, and warranties.
      </p>
      <div className="p-8 border border-dashed border-slate-300 rounded-xl bg-white text-center text-slate-400 text-sm">
        Equipment units, category tree, and installed base inventory.
      </div>
    </div>
  );
}
