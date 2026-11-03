export type OrgType = 'retailer' | 'wholesaler' | 'service_centre' | 'brand' | 'facility';
export type MemberRole = 'owner' | 'dispatcher' | 'technician' | 'accounts';
export type EngagementType = 'employee' | 'contractor' | 'marketplace';
export type PartyType = 'customer' | 'dealer' | 'brand' | 'vendor';
export type UnitStatus = 'in_stock' | 'sold' | 'installed' | 'under_repair' | 'scrapped';
export type ContractType = 'comprehensive' | 'non_comprehensive' | 'labour_only';
export type ContractStatus = 'draft' | 'active' | 'expired' | 'renewed' | 'cancelled';
export type PMFrequency = 'monthly' | 'quarterly' | 'half_yearly' | 'yearly';
export type PMVisitStatus = 'pending' | 'scheduled' | 'done' | 'skipped' | 'breached';
export type TicketPriority = 'P1' | 'P2' | 'P3';
export type TicketSource = 'phone' | 'whatsapp' | 'email' | 'portal' | 'walk_in';
export type TicketStatus = 'open' | 'in_progress' | 'awaiting_parts' | 'closed';
export type AssignmentStatus = 'offered' | 'accepted' | 'declined' | 'completed';

export interface Person {
  person_id: string;
  auth_user_id?: string | null;
  full_name: string;
  phone?: string | null;
  email?: string | null;
  base_city?: string | null;
  lang_pref?: string;
  phone_verified?: boolean;
  id_verified?: boolean;
  joined_at?: string;
}

export interface Organisation {
  org_id: string;
  name: string;
  org_type: OrgType;
  day_start?: string;
  day_end?: string;
  working_days?: string;
  plan?: string;
  created_at?: string;
}

export interface OrgMembership {
  membership_id: string;
  person_id: string;
  org_id: string;
  role: MemberRole;
  engagement_type?: EngagementType;
  emp_code?: string | null;
  is_active: boolean;
  joined_at?: string;
  person?: Person;
}

export interface Skill {
  skill_id: string;
  name: string;
  requires_certification: boolean;
}

export interface PersonSkill {
  person_skill_id: string;
  person_id: string;
  skill_id: string;
  level?: 'trainee' | 'competent' | 'expert';
  cert_number?: string | null;
  certified_from?: string | null;
  certified_until?: string | null;
  verified_by_org?: string | null;
  skill?: Skill;
}

export interface Party {
  party_id: string;
  org_id: string;
  name: string;
  party_type: PartyType;
  gstin?: string | null;
  phone?: string | null;
  attributes?: Record<string, unknown>;
  created_at?: string;
}

export interface Site {
  site_id: string;
  party_id: string;
  name: string;
  address?: string | null;
  pincode?: string | null;
  contact_name?: string | null;
  contact_phone?: string | null;
  geo_lat?: number | null;
  geo_lng?: number | null;
  created_at?: string;
}

export interface EquipmentCategory {
  category_id: string;
  org_id?: string | null;
  parent_id?: string | null;
  name: string;
  depth: number;
  attribute_schema: unknown[];
  created_at?: string;
}

export interface ProductModel {
  model_id: string;
  org_id: string;
  category_id: string;
  brand_name?: string | null;
  model_code?: string | null;
  name: string;
  spec?: Record<string, unknown>;
  default_warranty_months?: number;
  created_at?: string;
}

export interface EquipmentUnit {
  unit_id: string;
  org_id: string;
  model_id?: string | null;
  site_id?: string | null;
  sold_to_party_id?: string | null;
  serial_no?: string | null;
  sold_on?: string | null;
  installed_on?: string | null;
  warranty_end?: string | null;
  status: UnitStatus;
  attributes?: Record<string, unknown>;
  created_at?: string;
}

export interface Contract {
  contract_id: string;
  org_id: string;
  party_id: string;
  renewed_from_id?: string | null;
  contract_no: string;
  type?: ContractType;
  valid_from: string;
  valid_to: string;
  annual_value?: number;
  status: ContractStatus;
  sla_targets?: Record<string, unknown>;
  created_at?: string;
}

export interface ContractEquipment {
  contract_equipment_id: string;
  contract_id: string;
  unit_id: string;
  pm_visits_per_year: number;
  pm_frequency: PMFrequency;
}

export interface CoverageRule {
  rule_id: string;
  contract_id: string;
  scope: 'part_category' | 'fault_type' | 'labour' | 'travel' | 'consumable';
  match_value?: string | null;
  is_covered: boolean;
  cap_amount?: number | null;
  priority: number;
}

export interface PMVisit {
  pm_visit_id: string;
  contract_equipment_id: string;
  due_date: string;
  grace_days: number;
  status: PMVisitStatus;
  contract_equipment?: {
    unit_id?: string;
    contract?: {
      contract_no?: string;
      org_id?: string;
    };
  };
}

export interface JobType {
  job_type_id: string;
  org_id: string;
  code: string;
  name: string;
  checklist_schema?: unknown[];
  requires_signature: boolean;
  requires_parts: boolean;
}

export interface WorkflowState {
  state_id: string;
  job_type_id: string;
  code: string;
  label: string;
  allowed_next?: string[];
  is_initial: boolean;
  is_terminal: boolean;
  stops_sla_clock: boolean;
}

export interface Ticket {
  ticket_id: string;
  org_id: string;
  site_id?: string | null;
  unit_id?: string | null;
  ticket_no: string;
  public_token: string;
  source: TicketSource;
  fault_description?: string | null;
  priority: TicketPriority;
  reported_at: string;
  status: TicketStatus;
  created_at?: string;
  job?: Job[];
}

export interface Job {
  job_id: string;
  org_id: string;
  ticket_id?: string | null;
  pm_visit_id?: string | null;
  unit_id?: string | null;
  job_type_id?: string | null;
  current_state_id?: string | null;
  job_no: string;
  scheduled_start?: string | null;
  scheduled_end?: string | null;
  actual_start?: string | null;
  actual_end?: string | null;
  response_due?: string | null;
  resolution_due?: string | null;
  paused_minutes?: number;
  breached: boolean;
  customer_rating?: number | null;
  customer_feedback?: string | null;
  checklist_answers?: Record<string, unknown>;
  attachment_urls?: string[];
  signature_url?: string | null;
  technician_notes?: string | null;
  created_at?: string;
  workflow_state?: WorkflowState;
  job_assignment?: (JobAssignment & { person?: Person })[];
}

export interface JobAssignment {
  assignment_id: string;
  job_id: string;
  person_id: string;
  required_skill_id?: string | null;
  slot_start?: string | null;
  slot_end?: string | null;
  status: AssignmentStatus;
  is_lead: boolean;
  payout_amount?: number | null;
  offered_at?: string;
  responded_at?: string | null;
  person?: Person;
}

export interface JobStatusEvent {
  event_id: string;
  job_id: string;
  from_state_id?: string | null;
  to_state_id?: string | null;
  changed_by?: string | null;
  changed_at: string;
  geo_lat?: number | null;
  geo_lng?: number | null;
  synced_offline?: boolean;
}

export interface Part {
  part_id: string;
  org_id: string;
  part_no?: string | null;
  name: string;
  uom: string;
  sell_price: number;
  created_at?: string;
}

export interface JobPart {
  job_part_id: string;
  job_id: string;
  part_id?: string | null;
  contract_id?: string | null;
  rule_id?: string | null;
  quantity: number;
  unit_price?: number | null;
  is_chargeable: boolean;
  coverage_source?: 'amc' | 'warranty' | 'none';
  coverage_explanation?: string | null;
}

export interface TechnicianPerformance {
  person_id: string;
  full_name: string;
  jobs_assigned: number;
  jobs_completed: number;
  avg_rating: number | null;
  sla_breaches: number;
  completion_rate_pct: number | null;
}

export interface RenewalPipelineItem {
  org_id: string;
  contract_id: string;
  contract_no: string;
  valid_to: string;
  annual_value: number;
  status: string;
  customer_name: string;
  customer_phone?: string | null;
  days_until_expiry: number;
  equipment_count: number;
}

export interface OrgContextValue {
  org: Organisation;
  membership: OrgMembership;
  person: Person;
  isOwner: boolean;
  isDispatcher: boolean;
  isTechnician: boolean;
}
