import React from 'react';
import { Settings, Database, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-600" />
          Settings & Integrations
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage system parameters, WhatsApp Business API endpoints, and database connection.
        </p>
      </div>

      <div className="space-y-4">
        {/* Meta WhatsApp Integration Status */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                <CardTitle className="text-base font-semibold">Meta WhatsApp Business API</CardTitle>
              </div>
              <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-300">
                Configured
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Direct webhook endpoint: <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded">/api/whatsapp/webhook</code>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-slate-600">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="font-medium text-slate-500">Inbound Complaint Registration:</span>
              <span className="font-semibold text-slate-800">Enabled (Automatic P2 Ticket Creation)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="font-medium text-slate-500">Outbound Customer Notifications:</span>
              <span className="font-semibold text-slate-800">Ticket Raised, Technician Assigned, Job Closed</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="font-medium text-slate-500">Weekly Expiry Reminders:</span>
              <span className="font-semibold text-slate-800">Supabase Edge Function (`weekly-renewals`)</span>
            </div>
          </CardContent>
        </Card>

        {/* Database & Housekeeping Checks */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-600" />
                <CardTitle className="text-base font-semibold">PostgreSQL & pg_cron</CardTitle>
              </div>
              <Badge variant="outline" className="text-blue-700 bg-blue-50 border-blue-300">
                Schema v1.0
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Automated triggers, RLS isolation, and nightly cron jobs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-slate-600">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="font-medium text-slate-500">Nightly Checks Routine:</span>
              <span className="font-mono text-slate-800">SELECT fn_daily_checks() (23:00 IST)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="font-medium text-slate-500">Audit Logging:</span>
              <span className="font-semibold text-slate-800">BRIN Index / Append-Only Trigger on contract, job, assignment</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="font-medium text-slate-500">Double-Booking Guard:</span>
              <span className="font-semibold text-slate-800">GiST Exclusion Constraint on `job_assignment`</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
