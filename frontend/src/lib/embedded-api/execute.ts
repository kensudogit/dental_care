import { getOperationAST, parse } from 'graphql'
import { todayISO } from './helpers'
import { getEmbeddedStore } from './store'

type Vars = Record<string, unknown>

function apptFull(a: ReturnType<typeof getEmbeddedStore>['appointments'][number]) {
  return {
    ...a,
    reminders: [],
  }
}

export function executeEmbeddedGraphQL(
  query: string,
  variables: Vars = {},
): { data?: Record<string, unknown>; errors?: { message: string }[] } {
  try {
    const doc = parse(query)
    const op = getOperationAST(doc)
    const name = op?.name?.value
    const store = getEmbeddedStore()

    switch (name) {
      case 'DashboardPage': {
        const today = todayISO()
        return {
          data: {
            dashboard: store.dashboard(),
            appointments: { items: store.appointmentCalendar(today, today).map(apptFull) },
            treatments: { items: store.treatments.slice(0, 6) },
          },
        }
      }
      case 'HealthCheck':
        return { data: { health: { ok: true, service: 'embedded-api', version: '1.0.0' } } }
      case 'PatientsPage': {
        const page = variables.page as number | undefined
        const pageSize = variables.pageSize as number | undefined
        const result = store.paginatePatients(page, pageSize)
        return { data: { patients: result } }
      }
      case 'PatientDetail': {
        const id = String(variables.id ?? '')
        const patient = store.patient(id)
        const treatments = store.paginateTreatments(id, 1, 50)
        return { data: { patient, treatments } }
      }
      case 'PatientClinicalProfile':
        return { data: { patientProfile: store.patientProfile(String(variables.id ?? '')) } }
      case 'TreatmentsPage': {
        const result = store.paginateTreatments(undefined, variables.page as number, variables.pageSize as number)
        return { data: { treatments: result } }
      }
      case 'AppointmentsPage': {
        const result = store.paginateAppointments(variables.date as string, variables.page as number, variables.pageSize as number)
        return {
          data: {
            appointments: {
              items: result.items.map(apptFull),
              pageInfo: result.pageInfo,
            },
          },
        }
      }
      case 'AppointmentCalendarPage': {
        const from = String(variables.from ?? '')
        const to = String(variables.to ?? '')
        const scheduleDate = (variables.scheduleDate as string) || from
        return {
          data: {
            appointmentCalendar: store.appointmentCalendar(from, to).map(apptFull),
            chairs: store.chairs(),
            staffSchedules: store.staffSchedules(scheduleDate),
            noShowAppointments: store.noShowAppointments().map(apptFull),
          },
        }
      }
      case 'PatientXrays':
        return { data: { xrayImages: store.xrayImages(String(variables.patientId ?? '')) } }
      case 'SettingsOverview':
        return { data: { currentSession: store.session(), usage: store.usage() } }
      case 'AppShellSession':
        return { data: { currentSession: store.session() } }
      case 'OrganizationSettings':
        return { data: { organization: store.organization() } }
      case 'TeamMembers':
        return { data: { teamMembers: store.teamMembers() } }
      case 'BillingPage':
        return {
          data: {
            organization: store.organization(),
            subscriptionPlans: store.subscriptionPlans(),
            usage: store.usage(),
          },
        }
      case 'ApiKeysPage':
        return { data: { apiKeys: store.apiKeys() } }
      case 'AuditLogsPage': {
        const result = store.paginateAuditLogs(variables.page as number, variables.pageSize as number)
        return { data: { auditLogs: result } }
      }
      case 'UpdatePatientProfile':
      case 'UpsertInsurance':
      case 'UpdateAppointmentClinical':
      case 'CancelAppointment':
      case 'MarkAppointmentNoShow':
      case 'ScheduleReminder':
      case 'CreateXrayImage':
      case 'UpdateXrayImage':
      case 'DeleteXrayImage':
      case 'UpdateOrganization':
      case 'InviteTeamMember':
      case 'UpdateTeamMemberRole':
      case 'RemoveTeamMember':
      case 'ChangePlan':
      case 'CreateApiKey':
      case 'RevokeApiKey':
        return { data: { ok: true } }
      default:
        return { errors: [{ message: `Embedded API: unsupported operation ${name ?? 'anonymous'}` }] }
    }
  } catch (err) {
    return { errors: [{ message: err instanceof Error ? err.message : String(err) }] }
  }
}

export function embeddedGraphQLAvailable() {
  return true
}
