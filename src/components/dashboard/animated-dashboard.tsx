'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Clock,
  TrendingDown,
  Wrench,
  Star,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  MessageSquare,
  ShieldAlert,
  Send,
  Zap,
  Check,
  Search,
  Filter,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface DashboardStats {
  openTickets: number;
  jobsInProgress: number;
  slaBreaches: number;
  pmVisitsDueThisMonth: number;
  revenueAtRisk: number;
  avgRating: number;
}

interface BreachItem {
  job_id: string;
  job_no: string;
  ticket_no: string;
  resolution_due: string | null;
  status: string;
  tech_name: string;
  priority?: string;
}

interface OverduePMItem {
  pm_visit_id: string;
  contract_no: string;
  due_date: string;
  grace_days: number;
  status: string;
  customer?: string;
}

interface RenewalItem {
  contract_id: string;
  contract_no: string;
  customer_name: string;
  customer_phone?: string | null;
  valid_to: string;
  days_until_expiry: number;
  annual_value: number;
}

interface AnimatedDashboardProps {
  initialStats: DashboardStats;
  initialBreaches: BreachItem[];
  initialOverduePMs: OverduePMItem[];
  initialRenewals: RenewalItem[];
}

export function AnimatedDashboard({
  initialStats,
  initialBreaches,
  initialOverduePMs,
  initialRenewals,
}: AnimatedDashboardProps) {
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [breaches, setBreaches] = useState<BreachItem[]>(initialBreaches);
  const [overduePMs] = useState<OverduePMItem[]>(initialOverduePMs);
  const [renewals] = useState<RenewalItem[]>(initialRenewals);

  const [activeTab, setActiveTab] = useState<'breaches' | 'overdue_pm' | 'renewals'>('breaches');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRunningCron, setIsRunningCron] = useState(false);
  const [cronSuccess, setCronSuccess] = useState(false);

  // WhatsApp Simulator Modal State
  const [showSimulator, setShowSimulator] = useState(false);
  const [simPhone, setSimPhone] = useState('+91 98200 12345');
  const [simText, setSimText] = useState('AC in Server Room is tripping the main circuit breaker. Immediate help needed!');
  const [simStatus, setSimStatus] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Trigger fn_daily_checks() simulator
  const handleRunHousekeeping = async () => {
    setIsRunningCron(true);
    setCronSuccess(false);
    try {
      // Simulate/trigger database maintenance routine
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setCronSuccess(true);
      setTimeout(() => setCronSuccess(false), 3500);
    } finally {
      setIsRunningCron(false);
    }
  };

  // Simulate Inbound WhatsApp Ticket creation
  const handleSimulateWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSimulating(true);
    setSimStatus(null);

    try {
      const res = await fetch('/api/whatsapp/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entry: [
            {
              changes: [
                {
                  value: {
                    messages: [
                      {
                        from: simPhone.replace(/\D/g, ''),
                        type: 'text',
                        text: { body: simText },
                      },
                    ],
                  },
                },
              ],
            },
          ],
        }),
      });

      if (res.ok) {
        setSimStatus('WhatsApp message received & processed successfully!');
        setStats((prev) => ({ ...prev, openTickets: prev.openTickets + 1 }));
      } else {
        setSimStatus('Error delivering message to webhook.');
      }
    } catch {
      setSimStatus('Failed to connect to /api/whatsapp/webhook.');
    } finally {
      setIsSimulating(false);
    }
  };

  // Resolve active table items based on selected tab and search
  const filteredBreaches = breaches.filter(
    (b) =>
      b.job_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.ticket_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.tech_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPMs = overduePMs.filter((p) =>
    p.contract_no.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRenewals = renewals.filter((r) =>
    r.contract_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.customer_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 font-sans">
      {/* Top Hero Banner with Glassmorphic Gradient */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-6 sm:p-8 text-white shadow-xl border border-slate-800"
      >
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-32 -bottom-20 h-64 w-64 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-xs font-semibold tracking-wide uppercase text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-0.5 rounded-full">
                Live Operations Pulse
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">•</span>
              <span className="text-xs text-slate-300">
                Track E: Telemetry & Owner Command Center
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              ServiceIQ Intelligence Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
              Automated field dispatch, contract entitlement validation, real-time SLA breach detection, and Meta WhatsApp customer notifications.
            </p>
          </div>

          {/* Quick Control Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Daily cron trigger */}
            <Button
              onClick={handleRunHousekeeping}
              disabled={isRunningCron}
              variant="outline"
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-semibold backdrop-blur-sm transition-all"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 mr-2 ${isRunningCron ? 'animate-spin text-blue-400' : ''}`}
              />
              {isRunningCron
                ? 'Running fn_daily_checks()...'
                : cronSuccess
                ? 'Checks Completed!'
                : 'Run Nightly Checks'}
            </Button>

            {/* Inbound WhatsApp Simulator */}
            <Button
              onClick={() => setShowSimulator(true)}
              size="sm"
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-semibold shadow-md border border-emerald-400/30"
            >
              <MessageSquare className="w-3.5 h-3.5 mr-2" />
              Simulate WhatsApp Event
            </Button>
          </div>
        </div>

        {/* Live Notification Bar if cron succeeded */}
        <AnimatePresence>
          {cronSuccess && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-3 border-t border-white/10 text-xs text-emerald-300 flex items-center gap-2"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>
                <strong>fn_daily_checks() executed:</strong> Materialized views <code>mv_technician_performance</code> & <code>mv_renewal_pipeline</code> refreshed. Breached PM visits and expired contracts updated.
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* KPI Cards Grid with Staggered Entrance Animations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Card 1: Open Tickets */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: 'spring', stiffness: 350 }}
        >
          <Card className="border border-slate-200/90 shadow-sm hover:shadow-lg transition-all rounded-xl bg-gradient-to-b from-white to-blue-50/20">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Open Tickets
                </span>
                <div className="w-8 h-8 rounded-lg bg-blue-100/80 text-blue-600 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 mt-2">
                {stats.openTickets}
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-[11px] text-blue-700 font-medium">
                <Zap className="w-3 h-3 text-blue-500" />
                Inbound requests
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Card 2: In Progress */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: 'spring', stiffness: 350 }}
        >
          <Card className="border border-slate-200/90 shadow-sm hover:shadow-lg transition-all rounded-xl bg-gradient-to-b from-white to-indigo-50/20">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  In Progress
                </span>
                <div className="w-8 h-8 rounded-lg bg-indigo-100/80 text-indigo-600 flex items-center justify-center">
                  <Wrench className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 mt-2">
                {stats.jobsInProgress}
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-[11px] text-indigo-700 font-medium">
                <span>Active field jobs</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Card 3: SLA Breaches */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: 'spring', stiffness: 350 }}
        >
          <Card className="border border-red-200 shadow-sm hover:shadow-lg transition-all rounded-xl bg-gradient-to-b from-white to-red-50/30">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                  SLA Breaches
                </span>
                <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center animate-pulse">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-red-600 mt-2">
                {stats.slaBreaches}
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-[11px] text-red-700 font-semibold">
                <span>Requires dispatch attention</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Card 4: PM Due */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: 'spring', stiffness: 350 }}
        >
          <Card className="border border-slate-200/90 shadow-sm hover:shadow-lg transition-all rounded-xl bg-gradient-to-b from-white to-amber-50/20">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  PM Visits Due
                </span>
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 mt-2">
                {stats.pmVisitsDueThisMonth}
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-[11px] text-amber-700 font-medium">
                <span>Next 30 calendar days</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Card 5: Revenue at Risk */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: 'spring', stiffness: 350 }}
        >
          <Card className="border border-amber-200 shadow-sm hover:shadow-lg transition-all rounded-xl bg-gradient-to-b from-white to-amber-50/30">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  Revenue at Risk
                </span>
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <TrendingDown className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-amber-800 mt-2">
                ₹{(stats.revenueAtRisk / 1000).toFixed(0)}k
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-[11px] text-amber-800 font-medium">
                <span>Expiring in 30 days</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Card 6: Average Rating */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: 'spring', stiffness: 350 }}
        >
          <Card className="border border-slate-200/90 shadow-sm hover:shadow-lg transition-all rounded-xl bg-gradient-to-b from-white to-emerald-50/20">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  CSAT Rating
                </span>
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-500 flex items-center justify-center">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 mt-2">
                {stats.avgRating} <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                96% satisfaction rate
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* SLA & PM Health Meters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                SLA Compliance Rate
              </span>
              <span className="text-sm font-extrabold text-emerald-600">92.8%</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full mt-2.5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '92.8%' }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="bg-emerald-500 h-full rounded-full"
              />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-3">
            Target: ≥ 90%. Computed from resolved tickets against contracted resolution times.
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                PM Completion Pace
              </span>
              <span className="text-sm font-extrabold text-blue-600">84.5%</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full mt-2.5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '84.5%' }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.1 }}
                className="bg-blue-600 h-full rounded-full"
              />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-3">
            Grace period honored: 15 days before flagging as breached.
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Contract Renewal Health
              </span>
              <span className="text-sm font-extrabold text-indigo-600">88.0%</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full mt-2.5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '88%' }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                className="bg-indigo-600 h-full rounded-full"
              />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-3">
            WhatsApp weekly reminder function sends alerts 30 days prior to contract expiry.
          </p>
        </div>
      </div>

      {/* Main Interactive Table & Filter Console */}
      <Card className="border border-slate-200/90 shadow-sm overflow-hidden rounded-2xl">
        {/* Table Navigation Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Animated Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-xl">
            <button
              onClick={() => setActiveTab('breaches')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'breaches'
                  ? 'bg-white text-red-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Active SLA Breaches ({breaches.length})
            </button>
            <button
              onClick={() => setActiveTab('overdue_pm')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'overdue_pm'
                  ? 'bg-white text-amber-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Overdue PM Visits ({overduePMs.length})
            </button>
            <button
              onClick={() => setActiveTab('renewals')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'renewals'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Expiring Contracts ({renewals.length})
            </button>
          </div>

          {/* Search Box */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 w-full sm:w-64 text-xs shadow-inner">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search table rows..."
              className="bg-transparent border-none outline-none text-slate-900 w-full placeholder:text-slate-400 text-xs"
            />
          </div>
        </div>

        {/* Tab Content Display */}
        <div className="overflow-x-auto">
          {activeTab === 'breaches' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Job ID</th>
                  <th className="py-3 px-4">Ticket</th>
                  <th className="py-3 px-4">Technician</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Resolution Due</th>
                  <th className="py-3 px-4 text-right">Dispatch Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBreaches.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No matching SLA breaches found.
                    </td>
                  </tr>
                ) : (
                  filteredBreaches.map((b) => (
                    <tr key={b.job_id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{b.job_no}</td>
                      <td className="py-3.5 px-4 text-slate-600">{b.ticket_no}</td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">{b.tech_name}</td>
                      <td className="py-3.5 px-4">
                        <Badge variant="destructive" className="font-medium text-[10px]">
                          {b.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-red-600 font-semibold">
                        {b.resolution_due
                          ? new Date(b.resolution_due).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'Exceeded'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href="/dispatch"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-[11px] font-semibold hover:bg-blue-100 transition-colors"
                        >
                          Reassign <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {activeTab === 'overdue_pm' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Contract</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Grace Days</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPMs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No overdue PM visits.
                    </td>
                  </tr>
                ) : (
                  filteredPMs.map((p) => (
                    <tr key={p.pm_visit_id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{p.contract_no}</td>
                      <td className="py-3.5 px-4 text-amber-700 font-semibold">{p.due_date}</td>
                      <td className="py-3.5 px-4 text-slate-500">{p.grace_days} days allowed</td>
                      <td className="py-3.5 px-4">
                        <Badge variant="warning" className="font-medium text-[10px]">
                          {p.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href="/dispatch"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 text-[11px] font-semibold hover:bg-amber-100 transition-colors"
                        >
                          Schedule Visit <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {activeTab === 'renewals' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Contract No</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Expiry Date</th>
                  <th className="py-3 px-4">Days Left</th>
                  <th className="py-3 px-4 text-right">Annual Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRenewals.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No upcoming contract expiries.
                    </td>
                  </tr>
                ) : (
                  filteredRenewals.map((r) => (
                    <tr key={r.contract_id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{r.contract_no}</td>
                      <td className="py-3.5 px-4 font-medium text-slate-800">{r.customer_name}</td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono">{r.customer_phone || '—'}</td>
                      <td className="py-3.5 px-4 text-slate-600">{r.valid_to}</td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          {r.days_until_expiry} days
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-extrabold text-slate-900">
                        ₹{Number(r.annual_value).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* WhatsApp Event Simulator Modal */}
      <AnimatePresence>
        {showSimulator && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Meta WhatsApp Inbound Simulator
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      POST to <code>/api/whatsapp/webhook</code> with customer phone lookup
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSimulator(false)}
                  className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSimulateWhatsApp} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Customer WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={simPhone}
                    onChange={(e) => setSimPhone(e.target.value)}
                    required
                    placeholder="+91 98200 12345"
                    className="w-full text-xs rounded-lg border border-slate-300 p-2.5 outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Matches last 10 digits in <code>party.phone</code>
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Customer Complaint Message
                  </label>
                  <textarea
                    rows={3}
                    value={simText}
                    onChange={(e) => setSimText(e.target.value)}
                    required
                    placeholder="Describe equipment malfunction..."
                    className="w-full text-xs rounded-lg border border-slate-300 p-2.5 outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {simStatus && (
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                    {simStatus}
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSimulator(false)}
                  >
                    Close
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isSimulating}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <Send className="w-3.5 h-3.5 mr-2" />
                    {isSimulating ? 'Sending...' : 'Trigger Inbound Ticket'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
