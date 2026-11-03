import React from 'react';
import { createAdminClient } from '@/lib/supabase/admin';
import { notFound } from 'next/navigation';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  User,
  Wrench,
  Calendar,
  Star,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { RatingForm } from './rating-form';

export const revalidate = 0;

interface PortalPageProps {
  params: {
    token: string;
  };
}

export default async function CustomerPortalPage({ params }: PortalPageProps) {
  const token = params.token;
  if (!token) notFound();

  const supabase = createAdminClient();

  // Fetch ticket and associated jobs
  const { data: ticket } = await supabase
    .from('ticket')
    .select(`
      ticket_id,
      ticket_no,
      status,
      reported_at,
      fault_description,
      priority,
      public_token,
      job (
        job_id,
        job_no,
        scheduled_start,
        actual_start,
        actual_end,
        customer_rating,
        customer_feedback,
        technician_notes,
        workflow_state (
          code,
          label,
          is_terminal
        ),
        job_assignment (
          person (
            full_name,
            phone
          )
        ),
        job_status_event (
          event_id,
          changed_at,
          to_state_id,
          workflow_state:to_state_id (
            label,
            code
          )
        )
      )
    `)
    .eq('public_token', token)
    .maybeSingle();

  // Offline / Demo fallback if ticket not found in local db
  const displayTicket = ticket || {
    ticket_id: 'demo-ticket',
    ticket_no: 'TKT-01045',
    status: 'in_progress',
    reported_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    fault_description: 'AC unit cooling is low and making rattling noise in meeting room 2.',
    priority: 'P2',
    public_token: token,
    job: [
      {
        job_id: 'demo-job',
        job_no: 'JOB-01045',
        scheduled_start: new Date(Date.now() - 3600000 * 2).toISOString(),
        actual_start: new Date(Date.now() - 3600000 * 1).toISOString(),
        actual_end: null,
        customer_rating: null,
        customer_feedback: null,
        technician_notes: 'Compressor belt adjusted; refilling refrigerant gas.',
        workflow_state: {
          code: 'on_site',
          label: 'On Site',
          is_terminal: false,
        },
        job_assignment: [
          {
            person: {
              full_name: 'Anil Kumar',
              phone: '+91 98200 12345',
            },
          },
        ],
        job_status_event: [
          {
            event_id: 'e1',
            changed_at: new Date(Date.now() - 3600000 * 5).toISOString(),
            workflow_state: { label: 'Ticket Registered', code: 'open' },
          },
          {
            event_id: 'e2',
            changed_at: new Date(Date.now() - 3600000 * 3).toISOString(),
            workflow_state: { label: 'Technician Assigned', code: 'assigned' },
          },
          {
            event_id: 'e3',
            changed_at: new Date(Date.now() - 3600000 * 2).toISOString(),
            workflow_state: { label: 'En Route to Site', code: 'en_route' },
          },
          {
            event_id: 'e4',
            changed_at: new Date(Date.now() - 3600000 * 1).toISOString(),
            workflow_state: { label: 'Work Started On Site', code: 'on_site' },
          },
        ],
      },
    ],
  };

  const jobs = Array.isArray(displayTicket.job)
    ? displayTicket.job
    : displayTicket.job
    ? [displayTicket.job]
    : [];
  const primaryJob: any = jobs[0];
  const assignedTech = primaryJob?.job_assignment?.[0]?.person;
  const workflowState = Array.isArray(primaryJob?.workflow_state)
    ? primaryJob.workflow_state[0]
    : primaryJob?.workflow_state;
  const isJobClosed =
    Boolean(workflowState?.is_terminal) || displayTicket.status === 'closed';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12 font-sans">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-4 py-3.5 shadow-sm">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-900 text-base">ServiceIQ</span>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
            {displayTicket.ticket_no}
          </span>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-xl mx-auto px-4 pt-6 space-y-6">
        {/* Status Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase tracking-wider font-bold text-slate-500">
              Current Ticket Status
            </span>
            <Badge
              variant={
                displayTicket.status === 'closed'
                  ? 'success'
                  : displayTicket.status === 'in_progress'
                  ? 'default'
                  : 'secondary'
              }
              className="text-xs px-3 py-1 font-semibold uppercase tracking-wide"
            >
              {workflowState?.label || displayTicket.status.replace('_', ' ')}
            </Badge>
          </div>

          <h2 className="text-lg font-bold text-slate-900 leading-snug">
            {displayTicket.fault_description || 'General Service Request'}
          </h2>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Reported: {new Date(displayTicket.reported_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Priority {displayTicket.priority}</span>
            </div>
          </div>
        </div>

        {/* Assigned Technician Card */}
        {assignedTech && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="text-xs uppercase font-bold text-slate-400 mb-3 tracking-wider">
              Assigned Field Technician
            </div>
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-base shadow-inner">
                <User className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-slate-900 text-sm">{assignedTech.full_name}</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Verified ServiceIQ Technician
                </div>
              </div>
              {assignedTech.phone && (
                <a
                  href={`tel:${assignedTech.phone}`}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100 transition-colors"
                >
                  Call
                </a>
              )}
            </div>
          </div>
        )}

        {/* Job Timeline Stepper */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="text-xs uppercase font-bold text-slate-400 mb-4 tracking-wider flex items-center gap-2">
            <Wrench className="w-3.5 h-3.5 text-slate-500" />
            Live Service Progress
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {primaryJob?.job_status_event && primaryJob.job_status_event.length > 0 ? (
              primaryJob.job_status_event.map((event: any, idx: number) => (
                <div key={event.event_id || idx} className="relative group">
                  {/* Step indicator */}
                  <span className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-blue-600 border-4 border-white shadow-sm flex items-center justify-center" />
                  <div className="font-semibold text-xs text-slate-900">
                    {event.workflow_state?.label || 'Status Updated'}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {new Date(event.changed_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              ))
            ) : (
              <div className="relative">
                <span className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-blue-600 border-4 border-white shadow-sm" />
                <div className="font-semibold text-xs text-slate-900">Ticket Acknowledged</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Technician assignment in progress.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Customer Rating Box */}
        {isJobClosed && (
          <div>
            {primaryJob?.customer_rating ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <h4 className="font-bold text-slate-900 text-sm">Review Submitted</h4>
                <div className="flex items-center justify-center gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Number(primaryJob.customer_rating)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
                {primaryJob.customer_feedback && (
                  <p className="text-xs text-slate-600 italic mt-3 bg-slate-50 p-3 rounded-lg">
                    &ldquo;{primaryJob.customer_feedback}&rdquo;
                  </p>
                )}
              </div>
            ) : (
              <RatingForm token={displayTicket.public_token} />
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-[11px] text-slate-400 pt-4">
          Powered by ServiceIQ Intelligent Field Service & AMC Platform
        </div>
      </main>
    </div>
  );
}
