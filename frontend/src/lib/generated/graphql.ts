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

export type Appointment = {
  __typename?: 'Appointment';
  chair: Scalars['Int']['output'];
  endAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  notes: Scalars['String']['output'];
  patientId: Scalars['ID']['output'];
  patientName: Maybe<Scalars['String']['output']>;
  staff: Scalars['String']['output'];
  startAt: Scalars['String']['output'];
  status: Scalars['String']['output'];
  type: Scalars['String']['output'];
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

export type DashboardStats = {
  __typename?: 'DashboardStats';
  appointmentsToday: Scalars['Int']['output'];
  chairUtilization: Scalars['Float']['output'];
  noShowRate: Scalars['Float']['output'];
  patientsTotal: Scalars['Int']['output'];
  revenueThisMonth: Scalars['Int']['output'];
  treatmentsThisMonth: Scalars['Int']['output'];
};

export type Health = {
  __typename?: 'Health';
  ok: Scalars['Boolean']['output'];
  service: Scalars['String']['output'];
  version: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createAppointment: Appointment;
  createPatient: Patient;
};


export type MutationCreateAppointmentArgs = {
  input: CreateAppointmentInput;
};


export type MutationCreatePatientArgs = {
  input: CreatePatientInput;
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

export type Query = {
  __typename?: 'Query';
  appointments: Array<Appointment>;
  dashboard: DashboardStats;
  health: Health;
  patient: Maybe<Patient>;
  patients: Array<Patient>;
  treatments: Array<TreatmentRecord>;
};


export type QueryAppointmentsArgs = {
  date?: InputMaybe<Scalars['String']['input']>;
};


export type QueryPatientArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTreatmentsArgs = {
  patientId?: InputMaybe<Scalars['ID']['input']>;
};

export type TreatmentRecord = {
  __typename?: 'TreatmentRecord';
  diagnosis: Scalars['String']['output'];
  fee: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  patientId: Scalars['ID']['output'];
  patientName: Maybe<Scalars['String']['output']>;
  procedure: Scalars['String']['output'];
  staff: Scalars['String']['output'];
  status: Scalars['String']['output'];
  tags: Array<Scalars['String']['output']>;
  tooth: Scalars['String']['output'];
  visitDate: Scalars['String']['output'];
};

export type AppointmentsPageQueryVariables = Exact<{
  date?: InputMaybe<Scalars['String']['input']>;
}>;


export type AppointmentsPageQuery = { __typename?: 'Query', appointments: Array<{ __typename?: 'Appointment', id: string, patientId: string, patientName: string | null, chair: number, startAt: string, endAt: string, type: string, status: string, staff: string, notes: string }> };

export type DashboardPageQueryVariables = Exact<{ [key: string]: never; }>;


export type DashboardPageQuery = { __typename?: 'Query', dashboard: { __typename?: 'DashboardStats', patientsTotal: number, appointmentsToday: number, treatmentsThisMonth: number, revenueThisMonth: number, chairUtilization: number, noShowRate: number }, appointments: Array<{ __typename?: 'Appointment', id: string, patientId: string, patientName: string | null, chair: number, startAt: string, endAt: string, type: string, status: string, staff: string, notes: string }>, treatments: Array<{ __typename?: 'TreatmentRecord', id: string, patientId: string, patientName: string | null, visitDate: string, tooth: string, procedure: string, diagnosis: string, fee: number, staff: string, status: string, tags: Array<string> }> };

export type HealthCheckQueryVariables = Exact<{ [key: string]: never; }>;


export type HealthCheckQuery = { __typename?: 'Query', health: { __typename?: 'Health', ok: boolean, service: string, version: string } };

export type PatientsPageQueryVariables = Exact<{ [key: string]: never; }>;


export type PatientsPageQuery = { __typename?: 'Query', patients: Array<{ __typename?: 'Patient', id: string, chartNo: string, name: string, kana: string, birthDate: string, phone: string, email: string, allergies: string, notes: string, lastVisit: string, createdAt: string }> };

export type PatientDetailQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type PatientDetailQuery = { __typename?: 'Query', patient: { __typename?: 'Patient', id: string, chartNo: string, name: string, kana: string, birthDate: string, phone: string, email: string, allergies: string, notes: string, lastVisit: string, createdAt: string } | null, treatments: Array<{ __typename?: 'TreatmentRecord', id: string, visitDate: string, tooth: string, procedure: string, diagnosis: string, fee: number, staff: string, status: string, tags: Array<string> }> };

export type TreatmentsPageQueryVariables = Exact<{ [key: string]: never; }>;


export type TreatmentsPageQuery = { __typename?: 'Query', treatments: Array<{ __typename?: 'TreatmentRecord', id: string, patientId: string, patientName: string | null, visitDate: string, tooth: string, procedure: string, diagnosis: string, fee: number, staff: string, status: string, tags: Array<string> }> };


export const AppointmentsPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AppointmentsPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"date"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"appointments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"date"},"value":{"kind":"Variable","name":{"kind":"Name","value":"date"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"patientId"}},{"kind":"Field","name":{"kind":"Name","value":"patientName"}},{"kind":"Field","name":{"kind":"Name","value":"chair"}},{"kind":"Field","name":{"kind":"Name","value":"startAt"}},{"kind":"Field","name":{"kind":"Name","value":"endAt"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"staff"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}}]}}]} as unknown as DocumentNode<AppointmentsPageQuery, AppointmentsPageQueryVariables>;
export const DashboardPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DashboardPage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dashboard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"patientsTotal"}},{"kind":"Field","name":{"kind":"Name","value":"appointmentsToday"}},{"kind":"Field","name":{"kind":"Name","value":"treatmentsThisMonth"}},{"kind":"Field","name":{"kind":"Name","value":"revenueThisMonth"}},{"kind":"Field","name":{"kind":"Name","value":"chairUtilization"}},{"kind":"Field","name":{"kind":"Name","value":"noShowRate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"appointments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"patientId"}},{"kind":"Field","name":{"kind":"Name","value":"patientName"}},{"kind":"Field","name":{"kind":"Name","value":"chair"}},{"kind":"Field","name":{"kind":"Name","value":"startAt"}},{"kind":"Field","name":{"kind":"Name","value":"endAt"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"staff"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}},{"kind":"Field","name":{"kind":"Name","value":"treatments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"patientId"}},{"kind":"Field","name":{"kind":"Name","value":"patientName"}},{"kind":"Field","name":{"kind":"Name","value":"visitDate"}},{"kind":"Field","name":{"kind":"Name","value":"tooth"}},{"kind":"Field","name":{"kind":"Name","value":"procedure"}},{"kind":"Field","name":{"kind":"Name","value":"diagnosis"}},{"kind":"Field","name":{"kind":"Name","value":"fee"}},{"kind":"Field","name":{"kind":"Name","value":"staff"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}}]}}]}}]} as unknown as DocumentNode<DashboardPageQuery, DashboardPageQueryVariables>;
export const HealthCheckDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"HealthCheck"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"health"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"service"}},{"kind":"Field","name":{"kind":"Name","value":"version"}}]}}]}}]} as unknown as DocumentNode<HealthCheckQuery, HealthCheckQueryVariables>;
export const PatientsPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PatientsPage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"patients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chartNo"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"kana"}},{"kind":"Field","name":{"kind":"Name","value":"birthDate"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"allergies"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"lastVisit"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<PatientsPageQuery, PatientsPageQueryVariables>;
export const PatientDetailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PatientDetail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"patient"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chartNo"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"kana"}},{"kind":"Field","name":{"kind":"Name","value":"birthDate"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"allergies"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"lastVisit"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"treatments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"patientId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitDate"}},{"kind":"Field","name":{"kind":"Name","value":"tooth"}},{"kind":"Field","name":{"kind":"Name","value":"procedure"}},{"kind":"Field","name":{"kind":"Name","value":"diagnosis"}},{"kind":"Field","name":{"kind":"Name","value":"fee"}},{"kind":"Field","name":{"kind":"Name","value":"staff"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}}]}}]}}]} as unknown as DocumentNode<PatientDetailQuery, PatientDetailQueryVariables>;
export const TreatmentsPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TreatmentsPage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"treatments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"patientId"}},{"kind":"Field","name":{"kind":"Name","value":"patientName"}},{"kind":"Field","name":{"kind":"Name","value":"visitDate"}},{"kind":"Field","name":{"kind":"Name","value":"tooth"}},{"kind":"Field","name":{"kind":"Name","value":"procedure"}},{"kind":"Field","name":{"kind":"Name","value":"diagnosis"}},{"kind":"Field","name":{"kind":"Name","value":"fee"}},{"kind":"Field","name":{"kind":"Name","value":"staff"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}}]}}]}}]} as unknown as DocumentNode<TreatmentsPageQuery, TreatmentsPageQueryVariables>;