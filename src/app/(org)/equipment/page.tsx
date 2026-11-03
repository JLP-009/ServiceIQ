import React from 'react';
import { Wrench, Layers, ArrowUpRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function EquipmentPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Wrench className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Equipment Catalogue
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Product models, serialized installed units, warranty tracking, and service history.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs px-3 py-1 font-semibold border-blue-200 dark:border-blue-900/50 text-blue-700 dark:text-blue-400">
            Track B — Person 2 Module
          </Badge>
        </div>
      </div>

      <Card className="shadow-xs border-dashed border-2 border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40">
        <CardContent className="p-12 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
          <div className="max-w-md">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Installed Base & Asset Hierarchy
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Maintains customer site equipment inventory, serial numbers, QR code linking, and warranty date verification.
            </p>
          </div>
          <div className="pt-2 flex items-center gap-3">
            <Link
              href="/renewals"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              View AMC Covered Units <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
