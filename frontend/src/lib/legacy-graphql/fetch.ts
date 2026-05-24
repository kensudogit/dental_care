import { getOperationAST, parse } from 'graphql'
import { listApiBaseCandidates } from '@/lib/resolve-api-url'
import { paginateArray, toInt } from './helpers'

type Vars = Record<string, unknown>
type GqlResult = { data?: Record<string, unknown>; errors?: { message: string }[] }

const APPOINTMENT_FIELDS = `
  id patientId patientName chair startAt endAt type status staff notes
`

const PATIENT_FIELDS = `
  id chartNo name kana birthDate phone email allergies notes lastVisit createdAt
`

const TREATMENT_FIELDS = `
  id patientId patientName visitDate tooth procedure diagnosis fee staff status tags
`

const DEFAULT_CHAIRS = [
  { id: 'c1', number: 1, name: 'Chair 1', status: 'available' },
  { id: 'c2', number: 2, name: 'Chair 2', status: 'available' },
  { id: 'c3', number: 3, name: 'Chair 3', status: 'available' },
]

function enrichAppointment(raw: Record<string, unknown>): Record<string, unknown> {
  return {
    ...raw,
    staffRole: raw.staffRole ?? '',
    noShow: raw.noShow ?? false,
    cancelReason: raw.cancelReason ?? null,
    cancelledAt: raw.cancelledAt ?? null,
    reminders: raw.reminders ?? [],
  }
}

const LEGACY_QUERY: Record<string, string> = {
  DashboardPage: `
    query DashboardPageLegacy {
      dashboard {
        patientsTotal appointmentsToday treatmentsThisMonth revenueThisMonth
        chairUtilization noShowRate
      }
      appointments { ${APPOINTMENT_FIELDS} }
      treatments { ${TREATMENT_FIELDS} }
    }
  `,
  AppointmentsPage: `
    query AppointmentsPageLegacy($date: String) {
      appointments(date: $date) { ${APPOINTMENT_FIELDS} }
    }
  `,
  PatientsPage: `
    query PatientsPageLegacy {
      patients { ${PATIENT_FIELDS} }
    }
  `,
  PatientDetail: `
    query PatientDetailLegacy($id: ID!) {
      patient(id: $id) { ${PATIENT_FIELDS} }
      treatments(patientId: $id) { ${TREATMENT_FIELDS} }
    }
  `,
  TreatmentsPage: `
    query TreatmentsPageLegacy($patientId: ID) {
      treatments(patientId: $patientId) { ${TREATMENT_FIELDS} }
    }
  `,
  AppointmentCalendarPage: `
    query AppointmentCalendarLegacy($date: String) {
      appointments(date: $date) { ${APPOINTMENT_FIELDS} }
    }
  `,
}

function operationName(query: string): string | undefined {
  try {
    return getOperationAST(parse(query))?.name?.value
  } catch {
    return undefined
  }
}

function adaptLegacyData(name: string, data: Record<string, unknown>, variables: Vars): Record<string, unknown> {
  switch (name) {
    case 'DashboardPage': {
      const appointments = (data.appointments as unknown[]) ?? []
      const treatments = (data.treatments as unknown[]) ?? []
      return {
        dashboard: data.dashboard,
        appointments: { items: appointments.slice(0, 50) },
        treatments: { items: treatments.slice(0, 6) },
      }
    }
    case 'AppointmentsPage': {
      const items = (data.appointments as unknown[]) ?? []
      const page = toInt(variables.page, 1)
      const pageSize = toInt(variables.pageSize, 10)
      return { appointments: paginateArray(items, page, pageSize) }
    }
    case 'PatientsPage': {
      const items = (data.patients as unknown[]) ?? []
      const page = toInt(variables.page, 1)
      const pageSize = toInt(variables.pageSize, 10)
      return { patients: paginateArray(items, page, pageSize) }
    }
    case 'PatientDetail': {
      const treatments = (data.treatments as unknown[]) ?? []
      return {
        patient: data.patient,
        treatments: paginateArray(treatments, 1, 50),
      }
    }
    case 'TreatmentsPage': {
      const items = (data.treatments as unknown[]) ?? []
      const page = toInt(variables.page, 1)
      const pageSize = toInt(variables.pageSize, 10)
      return { treatments: paginateArray(items, page, pageSize) }
    }
    case 'AppointmentCalendarPage': {
      const items = ((data.appointments as Record<string, unknown>[]) ?? []).map(enrichAppointment)
      return {
        appointmentCalendar: items,
        chairs: DEFAULT_CHAIRS,
        staffSchedules: [],
        noShowAppointments: items.filter(
          (a) => a.status === 'no_show' || a.noShow === true,
        ) as Record<string, unknown>[],
      }
    }
    default:
      return data
  }
}

async function postToApi(query: string, variables: Vars): Promise<GqlResult | null> {
  const body = JSON.stringify({ query, variables })
  const init: RequestInit = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body,
    cache: 'no-store',
  }

  for (const base of listApiBaseCandidates()) {
    try {
      const res = await fetch(`${base}/graphql`, init)
      const json = (await res.json()) as GqlResult
      if (json.errors?.length) continue
      if (json.data) return json
    } catch {
      // try next candidate
    }
  }
  return null
}

export async function fetchLegacyGraphQL(
  query: string,
  variables: Vars = {},
): Promise<GqlResult | null> {
  const name = operationName(query)
  if (!name || !LEGACY_QUERY[name]) return null

  const legacyQuery = LEGACY_QUERY[name]
  const legacyVars =
    name === 'TreatmentsPage'
      ? { patientId: variables.patientId ?? null }
      : name === 'AppointmentsPage' || name === 'AppointmentCalendarPage'
        ? { date: variables.date ?? variables.from ?? variables.scheduleDate ?? null }
        : name === 'PatientDetail'
          ? { id: variables.id }
          : {}

  const result = await postToApi(legacyQuery, legacyVars)
  if (!result?.data) return null

  return {
    data: adaptLegacyData(name, result.data, variables),
  }
}

export function supportsLegacyGraphQL(query: string): boolean {
  const name = operationName(query)
  return Boolean(name && LEGACY_QUERY[name])
}
