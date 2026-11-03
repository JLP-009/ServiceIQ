import React from 'react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { OrgProvider } from '@/hooks/use-org';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import type { OrgContextValue, Organisation, OrgMembership, Person } from '@/types';

// Default fallback context when user is not yet logged into a specific tenant
const mockOrgContext: OrgContextValue = {
  org: {
    org_id: '00000000-0000-0000-0000-000000000001',
    name: 'ServiceIQ Enterprise',
    org_type: 'service_centre',
    day_start: '09:00',
    day_end: '18:00',
    working_days: 'Mon,Tue,Wed,Thu,Fri,Sat',
    plan: 'enterprise',
  },
  membership: {
    membership_id: '00000000-0000-0000-0000-000000000002',
    person_id: '00000000-0000-0000-0000-000000000003',
    org_id: '00000000-0000-0000-0000-000000000001',
    role: 'owner',
    engagement_type: 'employee',
    emp_code: 'ADMIN-01',
    is_active: true,
  },
  person: {
    person_id: '00000000-0000-0000-0000-000000000003',
    full_name: 'Operations Administrator',
    phone: '+91 98XXX XXXXX',
    email: 'admin@serviceiq.internal',
    base_city: 'Headquarters',
    lang_pref: 'en',
    phone_verified: true,
    id_verified: true,
  },
  isOwner: true,
  isDispatcher: true,
  isTechnician: false,
};

export default async function OrgLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let orgContextValue: OrgContextValue = mockOrgContext;

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

    if (user) {
      // Fetch person
      const { data: person } = await supabase
        .from('person')
        .select('*')
        .eq('auth_user_id', user.id)
        .maybeSingle();

      if (person) {
        // Fetch membership + org
        const { data: membership } = await supabase
          .from('org_membership')
          .select('*, organisation(*)')
          .eq('person_id', person.person_id)
          .eq('is_active', true)
          .limit(1)
          .maybeSingle();

        if (membership && membership.organisation) {
          const org = membership.organisation as Organisation;
          orgContextValue = {
            org,
            membership: membership as OrgMembership,
            person: person as Person,
            isOwner: membership.role === 'owner',
            isDispatcher: membership.role === 'dispatcher' || membership.role === 'owner',
            isTechnician: membership.role === 'technician',
          };
        }
      }
    }
  } catch (err) {
    console.warn('Using local fallback context for OrgLayout:', err);
  }
}

  return (
    <OrgProvider value={orgContextValue}>
      <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans antialiased text-slate-900 dark:text-slate-100 transition-colors">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-8">{children}</main>
        </div>
      </div>
    </OrgProvider>
  );
}
