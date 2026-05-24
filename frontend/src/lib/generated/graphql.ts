import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AllergyRecord = {
  __typename?: 'AllergyRecord';
  id: Scalars['ID']['output'];
  reaction: Scalars['String']['output'];
  severity: Scalars['String']['output'];
  substance: Scalars['String']['output'];
};

export type ApiKey = {
  __typename?: 'ApiKey';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastUsedAt: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  prefix: Scalars['String']['output'];
};

export type ApiKeyCreated = {
  __typename?: 'ApiKeyCreated';
  apiKey: ApiKey;
  secret: Scalars['String']['output'];
};

export type Appointment = {
  __typename?: 'Appointment';
  cancelReason: Maybe<Scalars['String']['output']>;
  cancelledAt: Maybe<Scalars['String']['output']>;
  chair: Scalars['Int']['output'];
  endAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  noShow: Scalars['Boolean']['output'];
  notes: Scalars['String']['output'];
  patientId: Scalars['ID']['output'];
  patientName: Maybe<Scalars['String']['output']>;
  reminders: Maybe<Array<ReminderNotification>>;
  staff: Scalars['String']['output'];
  staffRole: Scalars['String']['output'];
  startAt: Scalars['String']['output'];
  status: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type AppointmentPage = {
  __typename?: 'AppointmentPage';
  items: Array<Appointment>;
  pageInfo: PageInfo;
};

export type AuditLogEntry = {
  __typename?: 'AuditLogEntry';
  action: Scalars['String']['output'];
  actorName: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  ipAddress: Scalars['String']['output'];
  metadata: Scalars['String']['output'];
  resource: Scalars['String']['output'];
};

export type AuditLogPage = {
  __typename?: 'AuditLogPage';
  items: Array<AuditLogEntry>;
  pageInfo: PageInfo;
};

export type Chair = {
  __typename?: 'Chair';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  number: Scalars['Int']['output'];
  status: Scalars['String']['output'];
};

export type CreateApiKeyInput = {
  name: Scalars['String']['input'];
};

export type CreateAppointmentInput = {
  chair: Scalars['Int']['input'];
  endAt: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  patientId: Scalars['ID']['input'];
  staff: Scalars['String']['input'];
  startAt: Scalars['String']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
  type: Scalars['String']['input'];
};

export type CreatePatientInput = {
  allergies?: InputMaybe<Scalars['String']['input']>;
  birthDate?: InputMaybe<Scalars['String']['input']>;
  chartNo?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  kana?: InputMaybe<Scalars['String']['input']>;
  lastVisit?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type CreatePerioExamInput = {
  examDate: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  patientId: Scalars['ID']['input'];
  sites: Array<PerioSiteInput>;
  staff: Scalars['String']['input'];
};

export type CreateTreatmentInput = {
  assessment?: InputMaybe<Scalars['String']['input']>;
  diagnosis: Scalars['String']['input'];
  fee: Scalars['Int']['input'];
  objective?: InputMaybe<Scalars['String']['input']>;
  patientId: Scalars['ID']['input'];
  plan?: InputMaybe<Scalars['String']['input']>;
  procedure: Scalars['String']['input'];
  procedureCode?: InputMaybe<Scalars['String']['input']>;
  staff: Scalars['String']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
  subjective?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  tooth: Scalars['String']['input'];
  toothChartJson?: InputMaybe<Scalars['String']['input']>;
  visitDate: Scalars['String']['input'];
};

export type CreateXrayImageInput = {
  imageType?: InputMaybe<XrayImageType>;
  imageUrl: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  patientId: Scalars['ID']['input'];
  takenAt?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
  toothRegion?: InputMaybe<Scalars['String']['input']>;
};

export type DashboardStats = {
  __typename?: 'DashboardStats';
  appointmentsToday: Scalars['Int']['output'];
  chairUtilization: Scalars['Float']['output'];
  noShowRate: Scalars['Float']['output'];
  patientsTotal: Scalars['Int']['output'];
  revenueThisMonth: Scalars['Int']['output'];
  treatmentsThisMonth: Scalars['Int']['output'];
};

export type EmergencyContact = {
  __typename?: 'EmergencyContact';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  priority: Scalars['Int']['output'];
  relationship: Scalars['String']['output'];
};

export type FamilyMember = {
  __typename?: 'FamilyMember';
  id: Scalars['ID']['output'];
  linkedPatientId: Maybe<Scalars['ID']['output']>;
  name: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  relationship: Scalars['String']['output'];
};

export type Health = {
  __typename?: 'Health';
  ok: Scalars['Boolean']['output'];
  service: Scalars['String']['output'];
  version: Scalars['String']['output'];
};

export type InsuranceInfo = {
  __typename?: 'InsuranceInfo';
  copayCategory: Scalars['String']['output'];
  insurerName: Scalars['String']['output'];
  number: Scalars['String']['output'];
  symbol: Scalars['String']['output'];
  validUntil: Scalars['String']['output'];
};

export type InviteTeamMemberInput = {
  email: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  role: MemberRole;
};

export type MedicalHistory = {
  __typename?: 'MedicalHistory';
  condition: Scalars['String']['output'];
  diagnosedAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  notes: Scalars['String']['output'];
  resolved: Scalars['Boolean']['output'];
};

export enum MemberRole {
  Admin = 'ADMIN',
  Member = 'MEMBER',
  Owner = 'OWNER',
  Viewer = 'VIEWER'
}

export type Mutation = {
  __typename?: 'Mutation';
  cancelAppointment: Appointment;
  changePlan: Organization;
  createApiKey: ApiKeyCreated;
  createAppointment: Appointment;
  createPatient: Patient;
  createPerioExam: PerioExam;
  createTreatment: TreatmentRecord;
  createXrayImage: XrayImage;
  deletePerioExam: PerioExam;
  deleteTreatment: TreatmentRecord;
  deleteXrayImage: XrayImage;
  inviteTeamMember: TeamMember;
  markAppointmentNoShow: Appointment;
  removeTeamMember: Scalars['Boolean']['output'];
  revokeApiKey: Scalars['Boolean']['output'];
  scheduleReminder: ReminderNotification;
  updateAppointment: Appointment;
  updateOrganization: Organization;
  updatePatientProfile: PatientProfile;
  updatePerioExam: PerioExam;
  updateTeamMemberRole: TeamMember;
  updateTreatment: TreatmentRecord;
  updateXrayImage: XrayImage;
  upsertInsurance: InsuranceInfo;
};


export type MutationCancelAppointmentArgs = {
  id: Scalars['ID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
};


export type MutationChangePlanArgs = {
  tier: PlanTier;
};


export type MutationCreateApiKeyArgs = {
  input: CreateApiKeyInput;
};


export type MutationCreateAppointmentArgs = {
  input: CreateAppointmentInput;
};


export type MutationCreatePatientArgs = {
  input: CreatePatientInput;
};


export type MutationCreatePerioExamArgs = {
  input: CreatePerioExamInput;
};


export type MutationCreateTreatmentArgs = {
  input: CreateTreatmentInput;
};


export type MutationCreateXrayImageArgs = {
  input: CreateXrayImageInput;
};


export type MutationDeletePerioExamArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteTreatmentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteXrayImageArgs = {
  id: Scalars['ID']['input'];
};


export type MutationInviteTeamMemberArgs = {
  input: InviteTeamMemberInput;
};


export type MutationMarkAppointmentNoShowArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveTeamMemberArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRevokeApiKeyArgs = {
  id: Scalars['ID']['input'];
};


export type MutationScheduleReminderArgs = {
  input: ScheduleReminderInput;
};


export type MutationUpdateAppointmentArgs = {
  input: UpdateAppointmentInput;
};


export type MutationUpdateOrganizationArgs = {
  input: UpdateOrganizationInput;
};


export type MutationUpdatePatientProfileArgs = {
  input: UpdatePatientProfileInput;
};


export type MutationUpdatePerioExamArgs = {
  input: UpdatePerioExamInput;
};


export type MutationUpdateTeamMemberRoleArgs = {
  input: UpdateTeamMemberRoleInput;
};


export type MutationUpdateTreatmentArgs = {
  input: UpdateTreatmentInput;
};


export type MutationUpdateXrayImageArgs = {
  input: UpdateXrayImageInput;
};


export type MutationUpsertInsuranceArgs = {
  input: UpsertInsuranceInput;
};

export type Organization = {
  __typename?: 'Organization';
  chairCount: Scalars['Int']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  memberCount: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  planTier: PlanTier;
  slug: Scalars['String']['output'];
  subscriptionStatus: SubscriptionStatus;
  timezone: Scalars['String']['output'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  page: Scalars['Int']['output'];
  pageSize: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Patient = {
  __typename?: 'Patient';
  allergies: Scalars['String']['output'];
  birthDate: Scalars['String']['output'];
  chartNo: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  kana: Scalars['String']['output'];
  lastVisit: Scalars['String']['output'];
  name: Scalars['String']['output'];
  notes: Scalars['String']['output'];
  phone: Scalars['String']['output'];
};

export type PatientPage = {
  __typename?: 'PatientPage';
  items: Array<Patient>;
  pageInfo: PageInfo;
};

export type PatientProfile = {
  __typename?: 'PatientProfile';
  address: Scalars['String']['output'];
  allergies: Scalars['String']['output'];
  allergyRecords: Maybe<Array<AllergyRecord>>;
  birthDate: Scalars['String']['output'];
  chartNo: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  emergencyContacts: Maybe<Array<EmergencyContact>>;
  familyMembers: Maybe<Array<FamilyMember>>;
  gender: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  insurance: Maybe<InsuranceInfo>;
  kana: Scalars['String']['output'];
  lastVisit: Scalars['String']['output'];
  medicalHistories: Maybe<Array<MedicalHistory>>;
  name: Scalars['String']['output'];
  notes: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  questionnaires: Maybe<Array<Questionnaire>>;
  visitHistory: Maybe<Array<VisitRecord>>;
};

export type PerioExam = {
  __typename?: 'PerioExam';
  createdAt: Scalars['String']['output'];
  examDate: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  notes: Scalars['String']['output'];
  patientId: Scalars['ID']['output'];
  sites: Array<PerioSite>;
  staff: Scalars['String']['output'];
};

export type PerioSite = {
  __typename?: 'PerioSite';
  bop: Scalars['Boolean']['output'];
  mobility: Scalars['Int']['output'];
  pdBuccal: Scalars['Int']['output'];
  pdDistal: Scalars['Int']['output'];
  pdLingual: Scalars['Int']['output'];
  pdMesial: Scalars['Int']['output'];
  tooth: Scalars['String']['output'];
};

export type PerioSiteInput = {
  bop?: InputMaybe<Scalars['Boolean']['input']>;
  mobility?: InputMaybe<Scalars['Int']['input']>;
  pdBuccal?: InputMaybe<Scalars['Int']['input']>;
  pdDistal?: InputMaybe<Scalars['Int']['input']>;
  pdLingual?: InputMaybe<Scalars['Int']['input']>;
  pdMesial?: InputMaybe<Scalars['Int']['input']>;
  tooth: Scalars['String']['input'];
};

export type PlanFeature = {
  __typename?: 'PlanFeature';
  included: Scalars['Boolean']['output'];
  key: Scalars['String']['output'];
  label: Scalars['String']['output'];
  limit: Maybe<Scalars['Int']['output']>;
};

export enum PlanTier {
  Enterprise = 'ENTERPRISE',
  Free = 'FREE',
  Pro = 'PRO',
  Starter = 'STARTER'
}

export type Query = {
  __typename?: 'Query';
  apiKeys: Array<ApiKey>;
  appointmentCalendar: Array<Appointment>;
  appointments: AppointmentPage;
  auditLogs: AuditLogPage;
  chairs: Array<Chair>;
  currentSession: Session;
  dashboard: DashboardStats;
  health: Health;
  noShowAppointments: Array<Appointment>;
  organization: Organization;
  patient: Maybe<Patient>;
  patientProfile: Maybe<PatientProfile>;
  patients: PatientPage;
  perioExam: Maybe<PerioExam>;
  perioExams: Array<PerioExam>;
  searchPatients: Array<PatientProfile>;
  staffSchedules: Array<StaffSchedule>;
  subscriptionPlans: Array<SubscriptionPlan>;
  teamMembers: Array<TeamMember>;
  treatment: Maybe<TreatmentRecord>;
  treatments: TreatmentPage;
  usage: UsageSummary;
  xrayImage: Maybe<XrayImage>;
  xrayImages: Array<XrayImage>;
};


export type QueryAppointmentCalendarArgs = {
  from: Scalars['String']['input'];
  to: Scalars['String']['input'];
};


export type QueryAppointmentsArgs = {
  date?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAuditLogsArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryPatientArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPatientProfileArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPatientsArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryPerioExamArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPerioExamsArgs = {
  patientId: Scalars['ID']['input'];
};


export type QuerySearchPatientsArgs = {
  query?: InputMaybe<Scalars['String']['input']>;
};


export type QueryStaffSchedulesArgs = {
  date?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTreatmentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTreatmentsArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  patientId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryXrayImageArgs = {
  id: Scalars['ID']['input'];
};


export type QueryXrayImagesArgs = {
  patientId?: InputMaybe<Scalars['ID']['input']>;
};

export type Questionnaire = {
  __typename?: 'Questionnaire';
  chiefComplaint: Scalars['String']['output'];
  currentMedications: Scalars['String']['output'];
  dentalAnxiety: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  notes: Scalars['String']['output'];
  pregnancy: Scalars['Boolean']['output'];
  smoking: Scalars['Boolean']['output'];
  submittedAt: Scalars['String']['output'];
};

export type ReminderNotification = {
  __typename?: 'ReminderNotification';
  channel: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  recipient: Scalars['String']['output'];
  scheduledAt: Scalars['String']['output'];
  sentAt: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
};

export type ScheduleReminderInput = {
  appointmentId: Scalars['ID']['input'];
  channel: Scalars['String']['input'];
  recipient: Scalars['String']['input'];
  scheduledAt: Scalars['String']['input'];
};

export type Session = {
  __typename?: 'Session';
  organization: Organization;
  role: MemberRole;
  user: User;
};

export type StaffSchedule = {
  __typename?: 'StaffSchedule';
  date: Scalars['String']['output'];
  endTime: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  notes: Scalars['String']['output'];
  role: Scalars['String']['output'];
  staffId: Scalars['ID']['output'];
  staffName: Scalars['String']['output'];
  startTime: Scalars['String']['output'];
};

export type SubscriptionPlan = {
  __typename?: 'SubscriptionPlan';
  features: Array<PlanFeature>;
  maxMembers: Scalars['Int']['output'];
  maxPatients: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  priceMonthly: Scalars['Int']['output'];
  priceYearly: Scalars['Int']['output'];
  tier: PlanTier;
};

export enum SubscriptionStatus {
  Active = 'ACTIVE',
  Canceled = 'CANCELED',
  PastDue = 'PAST_DUE',
  Trialing = 'TRIALING'
}

export type TeamMember = {
  __typename?: 'TeamMember';
  id: Scalars['ID']['output'];
  joinedAt: Scalars['String']['output'];
  lastActiveAt: Scalars['String']['output'];
  role: MemberRole;
  user: User;
};

export type TreatmentPage = {
  __typename?: 'TreatmentPage';
  items: Array<TreatmentRecord>;
  pageInfo: PageInfo;
};

export type TreatmentRecord = {
  __typename?: 'TreatmentRecord';
  assessment: Scalars['String']['output'];
  diagnosis: Scalars['String']['output'];
  fee: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  objective: Scalars['String']['output'];
  patientId: Scalars['ID']['output'];
  patientName: Maybe<Scalars['String']['output']>;
  plan: Scalars['String']['output'];
  procedure: Scalars['String']['output'];
  procedureCode: Scalars['String']['output'];
  staff: Scalars['String']['output'];
  status: Scalars['String']['output'];
  subjective: Scalars['String']['output'];
  tags: Array<Scalars['String']['output']>;
  tooth: Scalars['String']['output'];
  toothChartJson: Scalars['String']['output'];
  visitDate: Scalars['String']['output'];
};

export type UpdateAppointmentInput = {
  chair?: InputMaybe<Scalars['Int']['input']>;
  endAt?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  staff?: InputMaybe<Scalars['String']['input']>;
  startAt?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateOrganizationInput = {
  chairCount?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  timezone?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePatientProfileInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePerioExamInput = {
  examDate?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  sites?: InputMaybe<Array<PerioSiteInput>>;
  staff?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTeamMemberRoleInput = {
  id: Scalars['ID']['input'];
  role: MemberRole;
};

export type UpdateTreatmentInput = {
  assessment?: InputMaybe<Scalars['String']['input']>;
  diagnosis?: InputMaybe<Scalars['String']['input']>;
  fee?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['ID']['input'];
  objective?: InputMaybe<Scalars['String']['input']>;
  plan?: InputMaybe<Scalars['String']['input']>;
  procedure?: InputMaybe<Scalars['String']['input']>;
  procedureCode?: InputMaybe<Scalars['String']['input']>;
  staff?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  subjective?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  tooth?: InputMaybe<Scalars['String']['input']>;
  toothChartJson?: InputMaybe<Scalars['String']['input']>;
  visitDate?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateXrayImageInput = {
  id: Scalars['ID']['input'];
  imageType?: InputMaybe<XrayImageType>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  takenAt?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  toothRegion?: InputMaybe<Scalars['String']['input']>;
};

export type UpsertInsuranceInput = {
  copayCategory: Scalars['String']['input'];
  insurerName: Scalars['String']['input'];
  number: Scalars['String']['input'];
  patientId: Scalars['ID']['input'];
  symbol: Scalars['String']['input'];
  validUntil: Scalars['String']['input'];
};

export type UsageSummary = {
  __typename?: 'UsageSummary';
  apiCallsLimit: Scalars['Int']['output'];
  apiCallsThisMonth: Scalars['Int']['output'];
  members: Scalars['Int']['output'];
  membersLimit: Scalars['Int']['output'];
  patients: Scalars['Int']['output'];
  patientsLimit: Scalars['Int']['output'];
};

export type User = {
  __typename?: 'User';
  avatarUrl: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type VisitRecord = {
  __typename?: 'VisitRecord';
  id: Scalars['ID']['output'];
  staff: Scalars['String']['output'];
  status: Scalars['String']['output'];
  summary: Scalars['String']['output'];
  visitDate: Scalars['String']['output'];
  visitType: Scalars['String']['output'];
};

export type XrayImage = {
  __typename?: 'XrayImage';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  imageType: XrayImageType;
  imageUrl: Scalars['String']['output'];
  notes: Scalars['String']['output'];
  patientId: Scalars['ID']['output'];
  takenAt: Scalars['String']['output'];
  title: Scalars['String']['output'];
  toothRegion: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export enum XrayImageType {
  Bitewing = 'BITEWING',
  Cephalometric = 'CEPHALOMETRIC',
  Intraoral = 'INTRAORAL',
  Panoramic = 'PANORAMIC',
  Periapical = 'PERIAPICAL'
}

export type AppointmentsPageQueryVariables = Exact<{
  date?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
}>;


export type AppointmentsPageQuery = { __typename?: 'Query', appointments: { __typename?: 'AppointmentPage', items: Array<{ __typename?: 'Appointment', id: string, patientId: string, patientName: string | null, chair: number, startAt: string, endAt: string, type: string, status: string, staff: string, staffRole: string, notes: string, noShow: boolean, cancelReason: string | null, cancelledAt: string | null }>, pageInfo: { __typename?: 'PageInfo', total: number, page: number, pageSize: number, totalPages: number } } };

export type PatientProfileFieldsFragment = { __typename?: 'PatientProfile', id: string, chartNo: string, name: string, kana: string, birthDate: string, gender: string, phone: string, email: string, address: string, allergies: string, notes: string, lastVisit: string, createdAt: string, insurance: { __typename?: 'InsuranceInfo', insurerName: string, symbol: string, number: string, copayCategory: string, validUntil: string } | null, medicalHistories: Array<{ __typename?: 'MedicalHistory', id: string, condition: string, diagnosedAt: string, notes: string, resolved: boolean }> | null, allergyRecords: Array<{ __typename?: 'AllergyRecord', id: string, substance: string, severity: string, reaction: string }> | null, familyMembers: Array<{ __typename?: 'FamilyMember', id: string, name: string, relationship: string, phone: string, linkedPatientId: string | null }> | null, questionnaires: Array<{ __typename?: 'Questionnaire', id: string, submittedAt: string, chiefComplaint: string, currentMedications: string, smoking: boolean, pregnancy: boolean, dentalAnxiety: number, notes: string }> | null, emergencyContacts: Array<{ __typename?: 'EmergencyContact', id: string, name: string, relationship: string, phone: string, priority: number }> | null, visitHistory: Array<{ __typename?: 'VisitRecord', id: string, visitDate: string, visitType: string, summary: string, staff: string, status: string }> | null };

export type PatientClinicalProfileQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type PatientClinicalProfileQuery = { __typename?: 'Query', patientProfile: { __typename?: 'PatientProfile', id: string, chartNo: string, name: string, kana: string, birthDate: string, gender: string, phone: string, email: string, address: string, allergies: string, notes: string, lastVisit: string, createdAt: string, insurance: { __typename?: 'InsuranceInfo', insurerName: string, symbol: string, number: string, copayCategory: string, validUntil: string } | null, medicalHistories: Array<{ __typename?: 'MedicalHistory', id: string, condition: string, diagnosedAt: string, notes: string, resolved: boolean }> | null, allergyRecords: Array<{ __typename?: 'AllergyRecord', id: string, substance: string, severity: string, reaction: string }> | null, familyMembers: Array<{ __typename?: 'FamilyMember', id: string, name: string, relationship: string, phone: string, linkedPatientId: string | null }> | null, questionnaires: Array<{ __typename?: 'Questionnaire', id: string, submittedAt: string, chiefComplaint: string, currentMedications: string, smoking: boolean, pregnancy: boolean, dentalAnxiety: number, notes: string }> | null, emergencyContacts: Array<{ __typename?: 'EmergencyContact', id: string, name: string, relationship: string, phone: string, priority: number }> | null, visitHistory: Array<{ __typename?: 'VisitRecord', id: string, visitDate: string, visitType: string, summary: string, staff: string, status: string }> | null } | null };

export type UpdatePatientProfileMutationVariables = Exact<{
  input: UpdatePatientProfileInput;
}>;


export type UpdatePatientProfileMutation = { __typename?: 'Mutation', updatePatientProfile: { __typename?: 'PatientProfile', id: string, chartNo: string, name: string, kana: string, birthDate: string, gender: string, phone: string, email: string, address: string, allergies: string, notes: string, lastVisit: string, createdAt: string, insurance: { __typename?: 'InsuranceInfo', insurerName: string, symbol: string, number: string, copayCategory: string, validUntil: string } | null, medicalHistories: Array<{ __typename?: 'MedicalHistory', id: string, condition: string, diagnosedAt: string, notes: string, resolved: boolean }> | null, allergyRecords: Array<{ __typename?: 'AllergyRecord', id: string, substance: string, severity: string, reaction: string }> | null, familyMembers: Array<{ __typename?: 'FamilyMember', id: string, name: string, relationship: string, phone: string, linkedPatientId: string | null }> | null, questionnaires: Array<{ __typename?: 'Questionnaire', id: string, submittedAt: string, chiefComplaint: string, currentMedications: string, smoking: boolean, pregnancy: boolean, dentalAnxiety: number, notes: string }> | null, emergencyContacts: Array<{ __typename?: 'EmergencyContact', id: string, name: string, relationship: string, phone: string, priority: number }> | null, visitHistory: Array<{ __typename?: 'VisitRecord', id: string, visitDate: string, visitType: string, summary: string, staff: string, status: string }> | null } };

export type UpsertInsuranceMutationVariables = Exact<{
  input: UpsertInsuranceInput;
}>;


export type UpsertInsuranceMutation = { __typename?: 'Mutation', upsertInsurance: { __typename?: 'InsuranceInfo', insurerName: string, symbol: string, number: string, copayCategory: string, validUntil: string } };

export type AppointmentClinicalFieldsFragment = { __typename?: 'Appointment', id: string, patientId: string, patientName: string | null, chair: number, startAt: string, endAt: string, type: string, status: string, staff: string, staffRole: string, notes: string, noShow: boolean, cancelReason: string | null, cancelledAt: string | null, reminders: Array<{ __typename?: 'ReminderNotification', id: string, channel: string, scheduledAt: string, status: string, sentAt: string | null, recipient: string }> | null };

export type AppointmentCalendarPageQueryVariables = Exact<{
  from: Scalars['String']['input'];
  to: Scalars['String']['input'];
  scheduleDate?: InputMaybe<Scalars['String']['input']>;
}>;


export type AppointmentCalendarPageQuery = { __typename?: 'Query', appointmentCalendar: Array<{ __typename?: 'Appointment', id: string, patientId: string, patientName: string | null, chair: number, startAt: string, endAt: string, type: string, status: string, staff: string, staffRole: string, notes: string, noShow: boolean, cancelReason: string | null, cancelledAt: string | null, reminders: Array<{ __typename?: 'ReminderNotification', id: string, channel: string, scheduledAt: string, status: string, sentAt: string | null, recipient: string }> | null }>, chairs: Array<{ __typename?: 'Chair', id: string, number: number, name: string, status: string }>, staffSchedules: Array<{ __typename?: 'StaffSchedule', id: string, staffName: string, role: string, date: string, startTime: string, endTime: string, notes: string }>, noShowAppointments: Array<{ __typename?: 'Appointment', id: string, patientId: string, patientName: string | null, chair: number, startAt: string, endAt: string, type: string, status: string, staff: string, staffRole: string, notes: string, noShow: boolean, cancelReason: string | null, cancelledAt: string | null, reminders: Array<{ __typename?: 'ReminderNotification', id: string, channel: string, scheduledAt: string, status: string, sentAt: string | null, recipient: string }> | null }> };

export type CancelAppointmentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
}>;


export type CancelAppointmentMutation = { __typename?: 'Mutation', cancelAppointment: { __typename?: 'Appointment', id: string, patientId: string, patientName: string | null, chair: number, startAt: string, endAt: string, type: string, status: string, staff: string, staffRole: string, notes: string, noShow: boolean, cancelReason: string | null, cancelledAt: string | null, reminders: Array<{ __typename?: 'ReminderNotification', id: string, channel: string, scheduledAt: string, status: string, sentAt: string | null, recipient: string }> | null } };

export type MarkAppointmentNoShowMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type MarkAppointmentNoShowMutation = { __typename?: 'Mutation', markAppointmentNoShow: { __typename?: 'Appointment', id: string, patientId: string, patientName: string | null, chair: number, startAt: string, endAt: string, type: string, status: string, staff: string, staffRole: string, notes: string, noShow: boolean, cancelReason: string | null, cancelledAt: string | null, reminders: Array<{ __typename?: 'ReminderNotification', id: string, channel: string, scheduledAt: string, status: string, sentAt: string | null, recipient: string }> | null } };

export type UpdateAppointmentClinicalMutationVariables = Exact<{
  input: UpdateAppointmentInput;
}>;


export type UpdateAppointmentClinicalMutation = { __typename?: 'Mutation', updateAppointment: { __typename?: 'Appointment', id: string, patientId: string, patientName: string | null, chair: number, startAt: string, endAt: string, type: string, status: string, staff: string, staffRole: string, notes: string, noShow: boolean, cancelReason: string | null, cancelledAt: string | null, reminders: Array<{ __typename?: 'ReminderNotification', id: string, channel: string, scheduledAt: string, status: string, sentAt: string | null, recipient: string }> | null } };

export type ScheduleReminderMutationVariables = Exact<{
  input: ScheduleReminderInput;
}>;


export type ScheduleReminderMutation = { __typename?: 'Mutation', scheduleReminder: { __typename?: 'ReminderNotification', id: string, channel: string, scheduledAt: string, status: string, recipient: string } };

export type DashboardPageQueryVariables = Exact<{ [key: string]: never; }>;


export type DashboardPageQuery = { __typename?: 'Query', dashboard: { __typename?: 'DashboardStats', patientsTotal: number, appointmentsToday: number, treatmentsThisMonth: number, revenueThisMonth: number, chairUtilization: number, noShowRate: number }, appointments: { __typename?: 'AppointmentPage', items: Array<{ __typename?: 'Appointment', id: string, patientId: string, patientName: string | null, chair: number, startAt: string, endAt: string, type: string, status: string, staff: string, notes: string }> }, treatments: { __typename?: 'TreatmentPage', items: Array<{ __typename?: 'TreatmentRecord', id: string, patientId: string, patientName: string | null, visitDate: string, tooth: string, procedure: string, diagnosis: string, fee: number, staff: string, status: string, tags: Array<string> }> } };

export type HealthCheckQueryVariables = Exact<{ [key: string]: never; }>;


export type HealthCheckQuery = { __typename?: 'Query', health: { __typename?: 'Health', ok: boolean, service: string, version: string } };

export type PageInfoFieldsFragment = { __typename?: 'PageInfo', total: number, page: number, pageSize: number, totalPages: number };

export type PatientsPageQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
}>;


export type PatientsPageQuery = { __typename?: 'Query', patients: { __typename?: 'PatientPage', items: Array<{ __typename?: 'Patient', id: string, chartNo: string, name: string, kana: string, birthDate: string, phone: string, email: string, allergies: string, notes: string, lastVisit: string, createdAt: string }>, pageInfo: { __typename?: 'PageInfo', total: number, page: number, pageSize: number, totalPages: number } } };

export type PatientDetailQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type PatientDetailQuery = { __typename?: 'Query', patient: { __typename?: 'Patient', id: string, chartNo: string, name: string, kana: string, birthDate: string, phone: string, email: string, allergies: string, notes: string, lastVisit: string, createdAt: string } | null, treatments: { __typename?: 'TreatmentPage', items: Array<{ __typename?: 'TreatmentRecord', id: string, visitDate: string, tooth: string, procedure: string, diagnosis: string, fee: number, staff: string, status: string, tags: Array<string> }>, pageInfo: { __typename?: 'PageInfo', total: number, page: number, pageSize: number, totalPages: number } } };

export type PerioExamFieldsFragment = { __typename?: 'PerioExam', id: string, patientId: string, examDate: string, staff: string, notes: string, createdAt: string, sites: Array<{ __typename?: 'PerioSite', tooth: string, pdMesial: number, pdBuccal: number, pdDistal: number, pdLingual: number, bop: boolean, mobility: number }> };

export type CreatePerioExamMutationVariables = Exact<{
  input: CreatePerioExamInput;
}>;


export type CreatePerioExamMutation = { __typename?: 'Mutation', createPerioExam: { __typename?: 'PerioExam', id: string, patientId: string, examDate: string, staff: string, notes: string, createdAt: string, sites: Array<{ __typename?: 'PerioSite', tooth: string, pdMesial: number, pdBuccal: number, pdDistal: number, pdLingual: number, bop: boolean, mobility: number }> } };

export type UpdatePerioExamMutationVariables = Exact<{
  input: UpdatePerioExamInput;
}>;


export type UpdatePerioExamMutation = { __typename?: 'Mutation', updatePerioExam: { __typename?: 'PerioExam', id: string, patientId: string, examDate: string, staff: string, notes: string, createdAt: string, sites: Array<{ __typename?: 'PerioSite', tooth: string, pdMesial: number, pdBuccal: number, pdDistal: number, pdLingual: number, bop: boolean, mobility: number }> } };

export type DeletePerioExamMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeletePerioExamMutation = { __typename?: 'Mutation', deletePerioExam: { __typename?: 'PerioExam', id: string, patientId: string } };

export type SettingsOverviewQueryVariables = Exact<{ [key: string]: never; }>;


export type SettingsOverviewQuery = { __typename?: 'Query', currentSession: { __typename?: 'Session', role: MemberRole, user: { __typename?: 'User', id: string, email: string, name: string }, organization: { __typename?: 'Organization', id: string, name: string, slug: string, planTier: PlanTier, subscriptionStatus: SubscriptionStatus, chairCount: number, memberCount: number } }, usage: { __typename?: 'UsageSummary', members: number, membersLimit: number, patients: number, patientsLimit: number, apiCallsThisMonth: number, apiCallsLimit: number } };

export type OrganizationSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type OrganizationSettingsQuery = { __typename?: 'Query', organization: { __typename?: 'Organization', id: string, name: string, slug: string, planTier: PlanTier, subscriptionStatus: SubscriptionStatus, chairCount: number, timezone: string, memberCount: number, createdAt: string } };

export type UpdateOrganizationMutationVariables = Exact<{
  input: UpdateOrganizationInput;
}>;


export type UpdateOrganizationMutation = { __typename?: 'Mutation', updateOrganization: { __typename?: 'Organization', id: string, name: string, slug: string, chairCount: number, timezone: string } };

export type TeamMembersQueryVariables = Exact<{ [key: string]: never; }>;


export type TeamMembersQuery = { __typename?: 'Query', teamMembers: Array<{ __typename?: 'TeamMember', id: string, role: MemberRole, joinedAt: string, lastActiveAt: string, user: { __typename?: 'User', id: string, email: string, name: string } }> };

export type InviteTeamMemberMutationVariables = Exact<{
  input: InviteTeamMemberInput;
}>;


export type InviteTeamMemberMutation = { __typename?: 'Mutation', inviteTeamMember: { __typename?: 'TeamMember', id: string, role: MemberRole, user: { __typename?: 'User', id: string, email: string, name: string } } };

export type UpdateTeamMemberRoleMutationVariables = Exact<{
  input: UpdateTeamMemberRoleInput;
}>;


export type UpdateTeamMemberRoleMutation = { __typename?: 'Mutation', updateTeamMemberRole: { __typename?: 'TeamMember', id: string, role: MemberRole } };

export type RemoveTeamMemberMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RemoveTeamMemberMutation = { __typename?: 'Mutation', removeTeamMember: boolean };

export type BillingPageQueryVariables = Exact<{ [key: string]: never; }>;


export type BillingPageQuery = { __typename?: 'Query', organization: { __typename?: 'Organization', planTier: PlanTier, subscriptionStatus: SubscriptionStatus }, subscriptionPlans: Array<{ __typename?: 'SubscriptionPlan', tier: PlanTier, name: string, priceMonthly: number, priceYearly: number, maxMembers: number, maxPatients: number, features: Array<{ __typename?: 'PlanFeature', key: string, label: string, included: boolean, limit: number | null }> }>, usage: { __typename?: 'UsageSummary', members: number, membersLimit: number, patients: number, patientsLimit: number, apiCallsThisMonth: number, apiCallsLimit: number } };

export type ChangePlanMutationVariables = Exact<{
  tier: PlanTier;
}>;


export type ChangePlanMutation = { __typename?: 'Mutation', changePlan: { __typename?: 'Organization', id: string, planTier: PlanTier } };

export type ApiKeysPageQueryVariables = Exact<{ [key: string]: never; }>;


export type ApiKeysPageQuery = { __typename?: 'Query', apiKeys: Array<{ __typename?: 'ApiKey', id: string, name: string, prefix: string, lastUsedAt: string | null, createdAt: string }> };

export type CreateApiKeyMutationVariables = Exact<{
  input: CreateApiKeyInput;
}>;


export type CreateApiKeyMutation = { __typename?: 'Mutation', createApiKey: { __typename?: 'ApiKeyCreated', secret: string, apiKey: { __typename?: 'ApiKey', id: string, name: string, prefix: string, createdAt: string } } };

export type RevokeApiKeyMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RevokeApiKeyMutation = { __typename?: 'Mutation', revokeApiKey: boolean };

export type AuditLogsPageQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
}>;


export type AuditLogsPageQuery = { __typename?: 'Query', auditLogs: { __typename?: 'AuditLogPage', items: Array<{ __typename?: 'AuditLogEntry', id: string, action: string, resource: string, actorName: string, ipAddress: string, metadata: string, createdAt: string }>, pageInfo: { __typename?: 'PageInfo', total: number, page: number, pageSize: number, totalPages: number } } };

export type AppShellSessionQueryVariables = Exact<{ [key: string]: never; }>;


export type AppShellSessionQuery = { __typename?: 'Query', currentSession: { __typename?: 'Session', role: MemberRole, user: { __typename?: 'User', name: string }, organization: { __typename?: 'Organization', name: string, planTier: PlanTier } } };

export type TreatmentFieldsFragment = { __typename?: 'TreatmentRecord', id: string, patientId: string, patientName: string | null, visitDate: string, tooth: string, procedure: string, procedureCode: string, diagnosis: string, fee: number, staff: string, status: string, tags: Array<string>, subjective: string, objective: string, assessment: string, plan: string, toothChartJson: string };

export type TreatmentsPageQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
}>;


export type TreatmentsPageQuery = { __typename?: 'Query', treatments: { __typename?: 'TreatmentPage', items: Array<{ __typename?: 'TreatmentRecord', id: string, patientId: string, patientName: string | null, visitDate: string, tooth: string, procedure: string, procedureCode: string, diagnosis: string, fee: number, staff: string, status: string, tags: Array<string>, subjective: string, objective: string, assessment: string, plan: string, toothChartJson: string }>, pageInfo: { __typename?: 'PageInfo', total: number, page: number, pageSize: number, totalPages: number } } };

export type PatientKartePageQueryVariables = Exact<{
  patientId: Scalars['ID']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
}>;


export type PatientKartePageQuery = { __typename?: 'Query', patient: { __typename?: 'Patient', id: string, name: string, chartNo: string, kana: string } | null, treatments: { __typename?: 'TreatmentPage', items: Array<{ __typename?: 'TreatmentRecord', id: string, patientId: string, patientName: string | null, visitDate: string, tooth: string, procedure: string, procedureCode: string, diagnosis: string, fee: number, staff: string, status: string, tags: Array<string>, subjective: string, objective: string, assessment: string, plan: string, toothChartJson: string }>, pageInfo: { __typename?: 'PageInfo', total: number, page: number, pageSize: number, totalPages: number } }, xrayImages: Array<{ __typename?: 'XrayImage', id: string, patientId: string, title: string, imageUrl: string, imageType: XrayImageType, toothRegion: string, takenAt: string, notes: string, createdAt: string, updatedAt: string }>, perioExams: Array<{ __typename?: 'PerioExam', id: string, patientId: string, examDate: string, staff: string, notes: string, createdAt: string, sites: Array<{ __typename?: 'PerioSite', tooth: string, pdMesial: number, pdBuccal: number, pdDistal: number, pdLingual: number, bop: boolean, mobility: number }> }> };

export type TreatmentRecordQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type TreatmentRecordQuery = { __typename?: 'Query', treatment: { __typename?: 'TreatmentRecord', id: string, patientId: string, patientName: string | null, visitDate: string, tooth: string, procedure: string, procedureCode: string, diagnosis: string, fee: number, staff: string, status: string, tags: Array<string>, subjective: string, objective: string, assessment: string, plan: string, toothChartJson: string } | null };

export type CreateTreatmentMutationVariables = Exact<{
  input: CreateTreatmentInput;
}>;


export type CreateTreatmentMutation = { __typename?: 'Mutation', createTreatment: { __typename?: 'TreatmentRecord', id: string, patientId: string, patientName: string | null, visitDate: string, tooth: string, procedure: string, procedureCode: string, diagnosis: string, fee: number, staff: string, status: string, tags: Array<string>, subjective: string, objective: string, assessment: string, plan: string, toothChartJson: string } };

export type UpdateTreatmentMutationVariables = Exact<{
  input: UpdateTreatmentInput;
}>;


export type UpdateTreatmentMutation = { __typename?: 'Mutation', updateTreatment: { __typename?: 'TreatmentRecord', id: string, patientId: string, patientName: string | null, visitDate: string, tooth: string, procedure: string, procedureCode: string, diagnosis: string, fee: number, staff: string, status: string, tags: Array<string>, subjective: string, objective: string, assessment: string, plan: string, toothChartJson: string } };

export type DeleteTreatmentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteTreatmentMutation = { __typename?: 'Mutation', deleteTreatment: { __typename?: 'TreatmentRecord', id: string, patientId: string } };

export type PatientXraysQueryVariables = Exact<{
  patientId: Scalars['ID']['input'];
}>;


export type PatientXraysQuery = { __typename?: 'Query', xrayImages: Array<{ __typename?: 'XrayImage', id: string, patientId: string, title: string, imageUrl: string, imageType: XrayImageType, toothRegion: string, takenAt: string, notes: string, createdAt: string, updatedAt: string }> };

export type CreateXrayImageMutationVariables = Exact<{
  input: CreateXrayImageInput;
}>;


export type CreateXrayImageMutation = { __typename?: 'Mutation', createXrayImage: { __typename?: 'XrayImage', id: string, title: string, imageUrl: string, imageType: XrayImageType, toothRegion: string, takenAt: string, notes: string, updatedAt: string } };

export type UpdateXrayImageMutationVariables = Exact<{
  input: UpdateXrayImageInput;
}>;


export type UpdateXrayImageMutation = { __typename?: 'Mutation', updateXrayImage: { __typename?: 'XrayImage', id: string, title: string, imageUrl: string, imageType: XrayImageType, toothRegion: string, takenAt: string, notes: string, updatedAt: string } };

export type DeleteXrayImageMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteXrayImageMutation = { __typename?: 'Mutation', deleteXrayImage: { __typename?: 'XrayImage', id: string, imageUrl: string } };

export const PatientProfileFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PatientProfileFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PatientProfile"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chartNo"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"kana"}},{"kind":"Field","name":{"kind":"Name","value":"birthDate"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"allergies"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"lastVisit"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"insurance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insurerName"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"copayCategory"}},{"kind":"Field","name":{"kind":"Name","value":"validUntil"}}]}},{"kind":"Field","name":{"kind":"Name","value":"medicalHistories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"condition"}},{"kind":"Field","name":{"kind":"Name","value":"diagnosedAt"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"resolved"}}]}},{"kind":"Field","name":{"kind":"Name","value":"allergyRecords"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"substance"}},{"kind":"Field","name":{"kind":"Name","value":"severity"}},{"kind":"Field","name":{"kind":"Name","value":"reaction"}}]}},{"kind":"Field","name":{"kind":"Name","value":"familyMembers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"relationship"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"linkedPatientId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"questionnaires"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"submittedAt"}},{"kind":"Field","name":{"kind":"Name","value":"chiefComplaint"}},{"kind":"Field","name":{"kind":"Name","value":"currentMedications"}},{"kind":"Field","name":{"kind":"Name","value":"smoking"}},{"kind":"Field","name":{"kind":"Name","value":"pregnancy"}},{"kind":"Field","name":{"kind":"Name","value":"dentalAnxiety"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}},{"kind":"Field","name":{"kind":"Name","value":"emergencyContacts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"relationship"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visitHistory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitDate"}},{"kind":"Field","name":{"kind":"Name","value":"visitType"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"staff"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<PatientProfileFieldsFragment, unknown>;
export const AppointmentClinicalFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AppointmentClinicalFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Appointment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"patientId"}},{"kind":"Field","name":{"kind":"Name","value":"patientName"}},{"kind":"Field","name":{"kind":"Name","value":"chair"}},{"kind":"Field","name":{"kind":"Name","value":"startAt"}},{"kind":"Field","name":{"kind":"Name","value":"endAt"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"staff"}},{"kind":"Field","name":{"kind":"Name","value":"staffRole"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"noShow"}},{"kind":"Field","name":{"kind":"Name","value":"cancelReason"}},{"kind":"Field","name":{"kind":"Name","value":"cancelledAt"}},{"kind":"Field","name":{"kind":"Name","value":"reminders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"channel"}},{"kind":"Field","name":{"kind":"Name","value":"scheduledAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"sentAt"}},{"kind":"Field","name":{"kind":"Name","value":"recipient"}}]}}]}}]} as unknown as DocumentNode<AppointmentClinicalFieldsFragment, unknown>;
export const PageInfoFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PageInfoFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PageInfo"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}}]}}]} as unknown as DocumentNode<PageInfoFieldsFragment, unknown>;
export const PerioExamFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PerioExamFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PerioExam"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"patientId"}},{"kind":"Field","name":{"kind":"Name","value":"examDate"}},{"kind":"Field","name":{"kind":"Name","value":"staff"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"sites"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tooth"}},{"kind":"Field","name":{"kind":"Name","value":"pdMesial"}},{"kind":"Field","name":{"kind":"Name","value":"pdBuccal"}},{"kind":"Field","name":{"kind":"Name","value":"pdDistal"}},{"kind":"Field","name":{"kind":"Name","value":"pdLingual"}},{"kind":"Field","name":{"kind":"Name","value":"bop"}},{"kind":"Field","name":{"kind":"Name","value":"mobility"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<PerioExamFieldsFragment, unknown>;
export const TreatmentFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TreatmentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TreatmentRecord"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"patientId"}},{"kind":"Field","name":{"kind":"Name","value":"patientName"}},{"kind":"Field","name":{"kind":"Name","value":"visitDate"}},{"kind":"Field","name":{"kind":"Name","value":"tooth"}},{"kind":"Field","name":{"kind":"Name","value":"procedure"}},{"kind":"Field","name":{"kind":"Name","value":"procedureCode"}},{"kind":"Field","name":{"kind":"Name","value":"diagnosis"}},{"kind":"Field","name":{"kind":"Name","value":"fee"}},{"kind":"Field","name":{"kind":"Name","value":"staff"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"subjective"}},{"kind":"Field","name":{"kind":"Name","value":"objective"}},{"kind":"Field","name":{"kind":"Name","value":"assessment"}},{"kind":"Field","name":{"kind":"Name","value":"plan"}},{"kind":"Field","name":{"kind":"Name","value":"toothChartJson"}}]}}]} as unknown as DocumentNode<TreatmentFieldsFragment, unknown>;
export const AppointmentsPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AppointmentsPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"date"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"appointments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"date"},"value":{"kind":"Variable","name":{"kind":"Name","value":"date"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"patientId"}},{"kind":"Field","name":{"kind":"Name","value":"patientName"}},{"kind":"Field","name":{"kind":"Name","value":"chair"}},{"kind":"Field","name":{"kind":"Name","value":"startAt"}},{"kind":"Field","name":{"kind":"Name","value":"endAt"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"staff"}},{"kind":"Field","name":{"kind":"Name","value":"staffRole"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"noShow"}},{"kind":"Field","name":{"kind":"Name","value":"cancelReason"}},{"kind":"Field","name":{"kind":"Name","value":"cancelledAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}}]}}]}}]}}]} as unknown as DocumentNode<AppointmentsPageQuery, AppointmentsPageQueryVariables>;
export const PatientClinicalProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PatientClinicalProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"patientProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PatientProfileFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PatientProfileFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PatientProfile"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chartNo"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"kana"}},{"kind":"Field","name":{"kind":"Name","value":"birthDate"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"allergies"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"lastVisit"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"insurance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insurerName"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"copayCategory"}},{"kind":"Field","name":{"kind":"Name","value":"validUntil"}}]}},{"kind":"Field","name":{"kind":"Name","value":"medicalHistories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"condition"}},{"kind":"Field","name":{"kind":"Name","value":"diagnosedAt"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"resolved"}}]}},{"kind":"Field","name":{"kind":"Name","value":"allergyRecords"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"substance"}},{"kind":"Field","name":{"kind":"Name","value":"severity"}},{"kind":"Field","name":{"kind":"Name","value":"reaction"}}]}},{"kind":"Field","name":{"kind":"Name","value":"familyMembers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"relationship"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"linkedPatientId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"questionnaires"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"submittedAt"}},{"kind":"Field","name":{"kind":"Name","value":"chiefComplaint"}},{"kind":"Field","name":{"kind":"Name","value":"currentMedications"}},{"kind":"Field","name":{"kind":"Name","value":"smoking"}},{"kind":"Field","name":{"kind":"Name","value":"pregnancy"}},{"kind":"Field","name":{"kind":"Name","value":"dentalAnxiety"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}},{"kind":"Field","name":{"kind":"Name","value":"emergencyContacts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"relationship"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visitHistory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitDate"}},{"kind":"Field","name":{"kind":"Name","value":"visitType"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"staff"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<PatientClinicalProfileQuery, PatientClinicalProfileQueryVariables>;
export const UpdatePatientProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePatientProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdatePatientProfileInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePatientProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PatientProfileFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PatientProfileFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PatientProfile"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chartNo"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"kana"}},{"kind":"Field","name":{"kind":"Name","value":"birthDate"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"allergies"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"lastVisit"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"insurance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insurerName"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"copayCategory"}},{"kind":"Field","name":{"kind":"Name","value":"validUntil"}}]}},{"kind":"Field","name":{"kind":"Name","value":"medicalHistories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"condition"}},{"kind":"Field","name":{"kind":"Name","value":"diagnosedAt"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"resolved"}}]}},{"kind":"Field","name":{"kind":"Name","value":"allergyRecords"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"substance"}},{"kind":"Field","name":{"kind":"Name","value":"severity"}},{"kind":"Field","name":{"kind":"Name","value":"reaction"}}]}},{"kind":"Field","name":{"kind":"Name","value":"familyMembers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"relationship"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"linkedPatientId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"questionnaires"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"submittedAt"}},{"kind":"Field","name":{"kind":"Name","value":"chiefComplaint"}},{"kind":"Field","name":{"kind":"Name","value":"currentMedications"}},{"kind":"Field","name":{"kind":"Name","value":"smoking"}},{"kind":"Field","name":{"kind":"Name","value":"pregnancy"}},{"kind":"Field","name":{"kind":"Name","value":"dentalAnxiety"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}},{"kind":"Field","name":{"kind":"Name","value":"emergencyContacts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"relationship"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visitHistory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitDate"}},{"kind":"Field","name":{"kind":"Name","value":"visitType"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"staff"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<UpdatePatientProfileMutation, UpdatePatientProfileMutationVariables>;
export const UpsertInsuranceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpsertInsurance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpsertInsuranceInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"upsertInsurance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insurerName"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"copayCategory"}},{"kind":"Field","name":{"kind":"Name","value":"validUntil"}}]}}]}}]} as unknown as DocumentNode<UpsertInsuranceMutation, UpsertInsuranceMutationVariables>;
export const AppointmentCalendarPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AppointmentCalendarPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"from"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"to"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"scheduleDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"appointmentCalendar"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"from"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AppointmentClinicalFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"chairs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"staffSchedules"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"date"},"value":{"kind":"Variable","name":{"kind":"Name","value":"scheduleDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"staffName"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}},{"kind":"Field","name":{"kind":"Name","value":"noShowAppointments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AppointmentClinicalFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AppointmentClinicalFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Appointment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"patientId"}},{"kind":"Field","name":{"kind":"Name","value":"patientName"}},{"kind":"Field","name":{"kind":"Name","value":"chair"}},{"kind":"Field","name":{"kind":"Name","value":"startAt"}},{"kind":"Field","name":{"kind":"Name","value":"endAt"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"staff"}},{"kind":"Field","name":{"kind":"Name","value":"staffRole"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"noShow"}},{"kind":"Field","name":{"kind":"Name","value":"cancelReason"}},{"kind":"Field","name":{"kind":"Name","value":"cancelledAt"}},{"kind":"Field","name":{"kind":"Name","value":"reminders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"channel"}},{"kind":"Field","name":{"kind":"Name","value":"scheduledAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"sentAt"}},{"kind":"Field","name":{"kind":"Name","value":"recipient"}}]}}]}}]} as unknown as DocumentNode<AppointmentCalendarPageQuery, AppointmentCalendarPageQueryVariables>;
export const CancelAppointmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CancelAppointment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"reason"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cancelAppointment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"reason"},"value":{"kind":"Variable","name":{"kind":"Name","value":"reason"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AppointmentClinicalFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AppointmentClinicalFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Appointment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"patientId"}},{"kind":"Field","name":{"kind":"Name","value":"patientName"}},{"kind":"Field","name":{"kind":"Name","value":"chair"}},{"kind":"Field","name":{"kind":"Name","value":"startAt"}},{"kind":"Field","name":{"kind":"Name","value":"endAt"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"staff"}},{"kind":"Field","name":{"kind":"Name","value":"staffRole"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"noShow"}},{"kind":"Field","name":{"kind":"Name","value":"cancelReason"}},{"kind":"Field","name":{"kind":"Name","value":"cancelledAt"}},{"kind":"Field","name":{"kind":"Name","value":"reminders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"channel"}},{"kind":"Field","name":{"kind":"Name","value":"scheduledAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"sentAt"}},{"kind":"Field","name":{"kind":"Name","value":"recipient"}}]}}]}}]} as unknown as DocumentNode<CancelAppointmentMutation, CancelAppointmentMutationVariables>;
export const MarkAppointmentNoShowDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MarkAppointmentNoShow"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"markAppointmentNoShow"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AppointmentClinicalFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AppointmentClinicalFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Appointment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"patientId"}},{"kind":"Field","name":{"kind":"Name","value":"patientName"}},{"kind":"Field","name":{"kind":"Name","value":"chair"}},{"kind":"Field","name":{"kind":"Name","value":"startAt"}},{"kind":"Field","name":{"kind":"Name","value":"endAt"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"staff"}},{"kind":"Field","name":{"kind":"Name","value":"staffRole"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"noShow"}},{"kind":"Field","name":{"kind":"Name","value":"cancelReason"}},{"kind":"Field","name":{"kind":"Name","value":"cancelledAt"}},{"kind":"Field","name":{"kind":"Name","value":"reminders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"channel"}},{"kind":"Field","name":{"kind":"Name","value":"scheduledAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"sentAt"}},{"kind":"Field","name":{"kind":"Name","value":"recipient"}}]}}]}}]} as unknown as DocumentNode<MarkAppointmentNoShowMutation, MarkAppointmentNoShowMutationVariables>;
export const UpdateAppointmentClinicalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateAppointmentClinical"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateAppointmentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateAppointment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AppointmentClinicalFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AppointmentClinicalFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Appointment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"patientId"}},{"kind":"Field","name":{"kind":"Name","value":"patientName"}},{"kind":"Field","name":{"kind":"Name","value":"chair"}},{"kind":"Field","name":{"kind":"Name","value":"startAt"}},{"kind":"Field","name":{"kind":"Name","value":"endAt"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"staff"}},{"kind":"Field","name":{"kind":"Name","value":"staffRole"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"noShow"}},{"kind":"Field","name":{"kind":"Name","value":"cancelReason"}},{"kind":"Field","name":{"kind":"Name","value":"cancelledAt"}},{"kind":"Field","name":{"kind":"Name","value":"reminders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"channel"}},{"kind":"Field","name":{"kind":"Name","value":"scheduledAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"sentAt"}},{"kind":"Field","name":{"kind":"Name","value":"recipient"}}]}}]}}]} as unknown as DocumentNode<UpdateAppointmentClinicalMutation, UpdateAppointmentClinicalMutationVariables>;
export const ScheduleReminderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ScheduleReminder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ScheduleReminderInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"scheduleReminder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"channel"}},{"kind":"Field","name":{"kind":"Name","value":"scheduledAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"recipient"}}]}}]}}]} as unknown as DocumentNode<ScheduleReminderMutation, ScheduleReminderMutationVariables>;
export const DashboardPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DashboardPage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dashboard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"patientsTotal"}},{"kind":"Field","name":{"kind":"Name","value":"appointmentsToday"}},{"kind":"Field","name":{"kind":"Name","value":"treatmentsThisMonth"}},{"kind":"Field","name":{"kind":"Name","value":"revenueThisMonth"}},{"kind":"Field","name":{"kind":"Name","value":"chairUtilization"}},{"kind":"Field","name":{"kind":"Name","value":"noShowRate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"appointments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"IntValue","value":"1"}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"IntValue","value":"50"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"patientId"}},{"kind":"Field","name":{"kind":"Name","value":"patientName"}},{"kind":"Field","name":{"kind":"Name","value":"chair"}},{"kind":"Field","name":{"kind":"Name","value":"startAt"}},{"kind":"Field","name":{"kind":"Name","value":"endAt"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"staff"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"treatments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"IntValue","value":"1"}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"IntValue","value":"6"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"patientId"}},{"kind":"Field","name":{"kind":"Name","value":"patientName"}},{"kind":"Field","name":{"kind":"Name","value":"visitDate"}},{"kind":"Field","name":{"kind":"Name","value":"tooth"}},{"kind":"Field","name":{"kind":"Name","value":"procedure"}},{"kind":"Field","name":{"kind":"Name","value":"diagnosis"}},{"kind":"Field","name":{"kind":"Name","value":"fee"}},{"kind":"Field","name":{"kind":"Name","value":"staff"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}}]}}]}}]}}]} as unknown as DocumentNode<DashboardPageQuery, DashboardPageQueryVariables>;
export const HealthCheckDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"HealthCheck"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"health"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"service"}},{"kind":"Field","name":{"kind":"Name","value":"version"}}]}}]}}]} as unknown as DocumentNode<HealthCheckQuery, HealthCheckQueryVariables>;
export const PatientsPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PatientsPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"patients"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chartNo"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"kana"}},{"kind":"Field","name":{"kind":"Name","value":"birthDate"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"allergies"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"lastVisit"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PageInfoFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PageInfoFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PageInfo"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}}]}}]} as unknown as DocumentNode<PatientsPageQuery, PatientsPageQueryVariables>;
export const PatientDetailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PatientDetail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"patient"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chartNo"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"kana"}},{"kind":"Field","name":{"kind":"Name","value":"birthDate"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"allergies"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"lastVisit"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"treatments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"patientId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"IntValue","value":"1"}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"IntValue","value":"50"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitDate"}},{"kind":"Field","name":{"kind":"Name","value":"tooth"}},{"kind":"Field","name":{"kind":"Name","value":"procedure"}},{"kind":"Field","name":{"kind":"Name","value":"diagnosis"}},{"kind":"Field","name":{"kind":"Name","value":"fee"}},{"kind":"Field","name":{"kind":"Name","value":"staff"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PageInfoFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PageInfoFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PageInfo"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}}]}}]} as unknown as DocumentNode<PatientDetailQuery, PatientDetailQueryVariables>;
export const CreatePerioExamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePerioExam"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePerioExamInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPerioExam"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PerioExamFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PerioExamFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PerioExam"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"patientId"}},{"kind":"Field","name":{"kind":"Name","value":"examDate"}},{"kind":"Field","name":{"kind":"Name","value":"staff"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"sites"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tooth"}},{"kind":"Field","name":{"kind":"Name","value":"pdMesial"}},{"kind":"Field","name":{"kind":"Name","value":"pdBuccal"}},{"kind":"Field","name":{"kind":"Name","value":"pdDistal"}},{"kind":"Field","name":{"kind":"Name","value":"pdLingual"}},{"kind":"Field","name":{"kind":"Name","value":"bop"}},{"kind":"Field","name":{"kind":"Name","value":"mobility"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<CreatePerioExamMutation, CreatePerioExamMutationVariables>;
export const UpdatePerioExamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePerioExam"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdatePerioExamInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePerioExam"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PerioExamFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PerioExamFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PerioExam"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"patientId"}},{"kind":"Field","name":{"kind":"Name","value":"examDate"}},{"kind":"Field","name":{"kind":"Name","value":"staff"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"sites"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tooth"}},{"kind":"Field","name":{"kind":"Name","value":"pdMesial"}},{"kind":"Field","name":{"kind":"Name","value":"pdBuccal"}},{"kind":"Field","name":{"kind":"Name","value":"pdDistal"}},{"kind":"Field","name":{"kind":"Name","value":"pdLingual"}},{"kind":"Field","name":{"kind":"Name","value":"bop"}},{"kind":"Field","name":{"kind":"Name","value":"mobility"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<UpdatePerioExamMutation, UpdatePerioExamMutationVariables>;
export const DeletePerioExamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeletePerioExam"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletePerioExam"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"patientId"}}]}}]}}]} as unknown as DocumentNode<DeletePerioExamMutation, DeletePerioExamMutationVariables>;
export const SettingsOverviewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SettingsOverview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentSession"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"planTier"}},{"kind":"Field","name":{"kind":"Name","value":"subscriptionStatus"}},{"kind":"Field","name":{"kind":"Name","value":"chairCount"}},{"kind":"Field","name":{"kind":"Name","value":"memberCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}},{"kind":"Field","name":{"kind":"Name","value":"usage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"members"}},{"kind":"Field","name":{"kind":"Name","value":"membersLimit"}},{"kind":"Field","name":{"kind":"Name","value":"patients"}},{"kind":"Field","name":{"kind":"Name","value":"patientsLimit"}},{"kind":"Field","name":{"kind":"Name","value":"apiCallsThisMonth"}},{"kind":"Field","name":{"kind":"Name","value":"apiCallsLimit"}}]}}]}}]} as unknown as DocumentNode<SettingsOverviewQuery, SettingsOverviewQueryVariables>;
export const OrganizationSettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OrganizationSettings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"planTier"}},{"kind":"Field","name":{"kind":"Name","value":"subscriptionStatus"}},{"kind":"Field","name":{"kind":"Name","value":"chairCount"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}},{"kind":"Field","name":{"kind":"Name","value":"memberCount"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<OrganizationSettingsQuery, OrganizationSettingsQueryVariables>;
export const UpdateOrganizationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateOrganization"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateOrganizationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateOrganization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"chairCount"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}}]}}]}}]} as unknown as DocumentNode<UpdateOrganizationMutation, UpdateOrganizationMutationVariables>;
export const TeamMembersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TeamMembers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teamMembers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"joinedAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastActiveAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<TeamMembersQuery, TeamMembersQueryVariables>;
export const InviteTeamMemberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"InviteTeamMember"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InviteTeamMemberInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"inviteTeamMember"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<InviteTeamMemberMutation, InviteTeamMemberMutationVariables>;
export const UpdateTeamMemberRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTeamMemberRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateTeamMemberRoleInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTeamMemberRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<UpdateTeamMemberRoleMutation, UpdateTeamMemberRoleMutationVariables>;
export const RemoveTeamMemberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveTeamMember"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeTeamMember"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<RemoveTeamMemberMutation, RemoveTeamMemberMutationVariables>;
export const BillingPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BillingPage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"planTier"}},{"kind":"Field","name":{"kind":"Name","value":"subscriptionStatus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"subscriptionPlans"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tier"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"priceMonthly"}},{"kind":"Field","name":{"kind":"Name","value":"priceYearly"}},{"kind":"Field","name":{"kind":"Name","value":"maxMembers"}},{"kind":"Field","name":{"kind":"Name","value":"maxPatients"}},{"kind":"Field","name":{"kind":"Name","value":"features"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"included"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"usage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"members"}},{"kind":"Field","name":{"kind":"Name","value":"membersLimit"}},{"kind":"Field","name":{"kind":"Name","value":"patients"}},{"kind":"Field","name":{"kind":"Name","value":"patientsLimit"}},{"kind":"Field","name":{"kind":"Name","value":"apiCallsThisMonth"}},{"kind":"Field","name":{"kind":"Name","value":"apiCallsLimit"}}]}}]}}]} as unknown as DocumentNode<BillingPageQuery, BillingPageQueryVariables>;
export const ChangePlanDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ChangePlan"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tier"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PlanTier"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"changePlan"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"tier"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tier"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"planTier"}}]}}]}}]} as unknown as DocumentNode<ChangePlanMutation, ChangePlanMutationVariables>;
export const ApiKeysPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ApiKeysPage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"apiKeys"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"prefix"}},{"kind":"Field","name":{"kind":"Name","value":"lastUsedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<ApiKeysPageQuery, ApiKeysPageQueryVariables>;
export const CreateApiKeyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateApiKey"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateApiKeyInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createApiKey"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"secret"}},{"kind":"Field","name":{"kind":"Name","value":"apiKey"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"prefix"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<CreateApiKeyMutation, CreateApiKeyMutationVariables>;
export const RevokeApiKeyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RevokeApiKey"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"revokeApiKey"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<RevokeApiKeyMutation, RevokeApiKeyMutationVariables>;
export const AuditLogsPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AuditLogsPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"resource"}},{"kind":"Field","name":{"kind":"Name","value":"actorName"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}}]}}]}}]}}]} as unknown as DocumentNode<AuditLogsPageQuery, AuditLogsPageQueryVariables>;
export const AppShellSessionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AppShellSession"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentSession"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"planTier"}}]}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<AppShellSessionQuery, AppShellSessionQueryVariables>;
export const TreatmentsPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TreatmentsPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"treatments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TreatmentFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TreatmentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TreatmentRecord"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"patientId"}},{"kind":"Field","name":{"kind":"Name","value":"patientName"}},{"kind":"Field","name":{"kind":"Name","value":"visitDate"}},{"kind":"Field","name":{"kind":"Name","value":"tooth"}},{"kind":"Field","name":{"kind":"Name","value":"procedure"}},{"kind":"Field","name":{"kind":"Name","value":"procedureCode"}},{"kind":"Field","name":{"kind":"Name","value":"diagnosis"}},{"kind":"Field","name":{"kind":"Name","value":"fee"}},{"kind":"Field","name":{"kind":"Name","value":"staff"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"subjective"}},{"kind":"Field","name":{"kind":"Name","value":"objective"}},{"kind":"Field","name":{"kind":"Name","value":"assessment"}},{"kind":"Field","name":{"kind":"Name","value":"plan"}},{"kind":"Field","name":{"kind":"Name","value":"toothChartJson"}}]}}]} as unknown as DocumentNode<TreatmentsPageQuery, TreatmentsPageQueryVariables>;
export const PatientKartePageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PatientKartePage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"patient"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"chartNo"}},{"kind":"Field","name":{"kind":"Name","value":"kana"}}]}},{"kind":"Field","name":{"kind":"Name","value":"treatments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"patientId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TreatmentFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"xrayImages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"patientId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"patientId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"imageType"}},{"kind":"Field","name":{"kind":"Name","value":"toothRegion"}},{"kind":"Field","name":{"kind":"Name","value":"takenAt"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"perioExams"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"patientId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"patientId"}},{"kind":"Field","name":{"kind":"Name","value":"examDate"}},{"kind":"Field","name":{"kind":"Name","value":"staff"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"sites"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tooth"}},{"kind":"Field","name":{"kind":"Name","value":"pdMesial"}},{"kind":"Field","name":{"kind":"Name","value":"pdBuccal"}},{"kind":"Field","name":{"kind":"Name","value":"pdDistal"}},{"kind":"Field","name":{"kind":"Name","value":"pdLingual"}},{"kind":"Field","name":{"kind":"Name","value":"bop"}},{"kind":"Field","name":{"kind":"Name","value":"mobility"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TreatmentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TreatmentRecord"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"patientId"}},{"kind":"Field","name":{"kind":"Name","value":"patientName"}},{"kind":"Field","name":{"kind":"Name","value":"visitDate"}},{"kind":"Field","name":{"kind":"Name","value":"tooth"}},{"kind":"Field","name":{"kind":"Name","value":"procedure"}},{"kind":"Field","name":{"kind":"Name","value":"procedureCode"}},{"kind":"Field","name":{"kind":"Name","value":"diagnosis"}},{"kind":"Field","name":{"kind":"Name","value":"fee"}},{"kind":"Field","name":{"kind":"Name","value":"staff"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"subjective"}},{"kind":"Field","name":{"kind":"Name","value":"objective"}},{"kind":"Field","name":{"kind":"Name","value":"assessment"}},{"kind":"Field","name":{"kind":"Name","value":"plan"}},{"kind":"Field","name":{"kind":"Name","value":"toothChartJson"}}]}}]} as unknown as DocumentNode<PatientKartePageQuery, PatientKartePageQueryVariables>;
export const TreatmentRecordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TreatmentRecord"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"treatment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TreatmentFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TreatmentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TreatmentRecord"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"patientId"}},{"kind":"Field","name":{"kind":"Name","value":"patientName"}},{"kind":"Field","name":{"kind":"Name","value":"visitDate"}},{"kind":"Field","name":{"kind":"Name","value":"tooth"}},{"kind":"Field","name":{"kind":"Name","value":"procedure"}},{"kind":"Field","name":{"kind":"Name","value":"procedureCode"}},{"kind":"Field","name":{"kind":"Name","value":"diagnosis"}},{"kind":"Field","name":{"kind":"Name","value":"fee"}},{"kind":"Field","name":{"kind":"Name","value":"staff"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"subjective"}},{"kind":"Field","name":{"kind":"Name","value":"objective"}},{"kind":"Field","name":{"kind":"Name","value":"assessment"}},{"kind":"Field","name":{"kind":"Name","value":"plan"}},{"kind":"Field","name":{"kind":"Name","value":"toothChartJson"}}]}}]} as unknown as DocumentNode<TreatmentRecordQuery, TreatmentRecordQueryVariables>;
export const CreateTreatmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTreatment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateTreatmentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTreatment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TreatmentFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TreatmentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TreatmentRecord"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"patientId"}},{"kind":"Field","name":{"kind":"Name","value":"patientName"}},{"kind":"Field","name":{"kind":"Name","value":"visitDate"}},{"kind":"Field","name":{"kind":"Name","value":"tooth"}},{"kind":"Field","name":{"kind":"Name","value":"procedure"}},{"kind":"Field","name":{"kind":"Name","value":"procedureCode"}},{"kind":"Field","name":{"kind":"Name","value":"diagnosis"}},{"kind":"Field","name":{"kind":"Name","value":"fee"}},{"kind":"Field","name":{"kind":"Name","value":"staff"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"subjective"}},{"kind":"Field","name":{"kind":"Name","value":"objective"}},{"kind":"Field","name":{"kind":"Name","value":"assessment"}},{"kind":"Field","name":{"kind":"Name","value":"plan"}},{"kind":"Field","name":{"kind":"Name","value":"toothChartJson"}}]}}]} as unknown as DocumentNode<CreateTreatmentMutation, CreateTreatmentMutationVariables>;
export const UpdateTreatmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTreatment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateTreatmentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTreatment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TreatmentFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TreatmentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TreatmentRecord"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"patientId"}},{"kind":"Field","name":{"kind":"Name","value":"patientName"}},{"kind":"Field","name":{"kind":"Name","value":"visitDate"}},{"kind":"Field","name":{"kind":"Name","value":"tooth"}},{"kind":"Field","name":{"kind":"Name","value":"procedure"}},{"kind":"Field","name":{"kind":"Name","value":"procedureCode"}},{"kind":"Field","name":{"kind":"Name","value":"diagnosis"}},{"kind":"Field","name":{"kind":"Name","value":"fee"}},{"kind":"Field","name":{"kind":"Name","value":"staff"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"subjective"}},{"kind":"Field","name":{"kind":"Name","value":"objective"}},{"kind":"Field","name":{"kind":"Name","value":"assessment"}},{"kind":"Field","name":{"kind":"Name","value":"plan"}},{"kind":"Field","name":{"kind":"Name","value":"toothChartJson"}}]}}]} as unknown as DocumentNode<UpdateTreatmentMutation, UpdateTreatmentMutationVariables>;
export const DeleteTreatmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteTreatment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteTreatment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"patientId"}}]}}]}}]} as unknown as DocumentNode<DeleteTreatmentMutation, DeleteTreatmentMutationVariables>;
export const PatientXraysDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PatientXrays"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"xrayImages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"patientId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"patientId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"imageType"}},{"kind":"Field","name":{"kind":"Name","value":"toothRegion"}},{"kind":"Field","name":{"kind":"Name","value":"takenAt"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<PatientXraysQuery, PatientXraysQueryVariables>;
export const CreateXrayImageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateXrayImage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateXrayImageInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createXrayImage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"imageType"}},{"kind":"Field","name":{"kind":"Name","value":"toothRegion"}},{"kind":"Field","name":{"kind":"Name","value":"takenAt"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CreateXrayImageMutation, CreateXrayImageMutationVariables>;
export const UpdateXrayImageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateXrayImage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateXrayImageInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateXrayImage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"imageType"}},{"kind":"Field","name":{"kind":"Name","value":"toothRegion"}},{"kind":"Field","name":{"kind":"Name","value":"takenAt"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateXrayImageMutation, UpdateXrayImageMutationVariables>;
export const DeleteXrayImageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteXrayImage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteXrayImage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}}]}}]}}]} as unknown as DocumentNode<DeleteXrayImageMutation, DeleteXrayImageMutationVariables>;