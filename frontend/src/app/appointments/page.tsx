import { AppointmentManager } from '@/components/AppointmentManager'
import {
  AppointmentCalendarPageDocument,
  type AppointmentCalendarPageQuery,
} from '@/lib/generated/graphql'
import { gqlRequest } from '@/lib/gql'

export const dynamic = 'force-dynamic'

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> }

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function pickDate(params: Record<string, string | string[] | undefined>) {
  const raw = params.date
  const val = Array.isArray(raw) ? raw[0] : raw
  return val && /^\d{4}-\d{2}-\d{2}$/.test(val) ? val : todayISO()
}

const emptyCalendar: AppointmentCalendarPageQuery = {
  appointmentCalendar: [],
  chairs: [],
  staffSchedules: [],
  noShowAppointments: [],
}

export default async function AppointmentsPage({ searchParams }: Props) {
  const params = await searchParams
  const date = pickDate(params)
  let error: string | null = null
  let calendar: AppointmentCalendarPageQuery = emptyCalendar

  try {
    calendar = await gqlRequest(AppointmentCalendarPageDocument, {
      from: date,
      to: date,
      scheduleDate: date,
    })
  } catch (e) {
    error = e instanceof Error ? e.message : 'GraphQL error'
  }

  return (
    <>
      <div className="page-head">
        <h2>Appointments</h2>
        <p>
          GraphQL <code>appointmentCalendar</code>, <code>chairs</code>,{' '}
          <code>staffSchedules</code>
        </p>
      </div>
      {error ? <div className="alert">{error}</div> : null}
      <AppointmentManager date={date} initial={calendar} />
    </>
  )
}
