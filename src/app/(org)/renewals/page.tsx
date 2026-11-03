import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { RenewalPipelineItem } from '@/types';

export const revalidate = 0;

export default async function RenewalsPage() {
  const supabase = createClient();

  let renewals: RenewalPipelineItem[] = [
    {
      org_id: '00000000-0000-0000-0000-000000000001',
      contract_id: 'c1',
      contract_no: 'AMC-2026-0042',
      valid_to: '2026-11-20',
      annual_value: 120000,
      status: 'active',
      customer_name: 'Metro Diagnostics & Labs',
      customer_phone: '+91 98201 11223',
      days_until_expiry: 17,
      equipment_count: 8,
    },
    {
      org_id: '00000000-0000-0000-0000-000000000001',
      contract_id: 'c2',
      contract_no: 'AMC-2026-0058',
      valid_to: '2026-11-28',
      annual_value: 75000,
      status: 'active',
      customer_name: 'Sterling Residency Co-op',
      customer_phone: '+91 98202 33445',
      days_until_expiry: 25,
      equipment_count: 4,
    },
    {
      org_id: '00000000-0000-0000-0000-000000000001',
      contract_id: 'c3',
      contract_no: 'AMC-2026-0081',
      valid_to: '2026-12-15',
      annual_value: 50000,
      status: 'active',
      customer_name: 'Blue Star Towers',
      customer_phone: '+91 98203 55667',
      days_until_expiry: 42,
      equipment_count: 3,
    },
  ];

  try {
    const { data } = await supabase.from('v_renewal_pipeline').select('*');
    if (data && data.length > 0) {
      renewals = data as RenewalPipelineItem[];
    }
  } catch (err) {
    console.warn('RenewalsPage using fallback data:', err);
  }

  const expiringIn30Days = renewals.filter((r) => r.days_until_expiry <= 30);
  const totalValueAtRisk = expiringIn30Days.reduce(
    (acc, curr) => acc + Number(curr.annual_value || 0),
    0
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <RefreshCw className="w-6 h-6 text-blue-600" />
            AMC Renewal Pipeline
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Tracking contracts approaching expiry. Reminders triggered weekly via Meta WhatsApp API Edge Function.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="warning" className="text-xs px-3 py-1 font-semibold">
            ₹{totalValueAtRisk.toLocaleString('en-IN')} Expiring within 30 days
          </Badge>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-base font-semibold">Upcoming Contract Renewals</CardTitle>
          <CardDescription className="text-xs">
            Sourced from materialized view <code className="text-slate-700 bg-slate-100 px-1 py-0.5 rounded">v_renewal_pipeline</code>
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Contract No</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4 text-center">Covered Units</th>
                  <th className="py-3 px-4">Expiry Date</th>
                  <th className="py-3 px-4">Days Left</th>
                  <th className="py-3 px-4 text-right">Annual Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {renewals.map((r) => (
                  <tr key={r.contract_id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">{r.contract_no}</td>
                    <td className="py-3 px-4 text-slate-700">{r.customer_name}</td>
                    <td className="py-3 px-4 text-slate-500 font-mono">{r.customer_phone || '—'}</td>
                    <td className="py-3 px-4 text-center">{r.equipment_count} units</td>
                    <td className="py-3 px-4 text-slate-600">{r.valid_to}</td>
                    <td className="py-3 px-4">
                      {r.days_until_expiry <= 30 ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">
                          {r.days_until_expiry} days
                        </span>
                      ) : (
                        <span className="text-slate-600">{r.days_until_expiry} days</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">
                      ₹{Number(r.annual_value).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
