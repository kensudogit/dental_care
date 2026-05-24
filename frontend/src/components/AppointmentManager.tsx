'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { StatusBadge } from '@/components/StatusBadge'
import {
  CancelAppointmentDocument,
  MarkAppointmentNoShowDocument,
  ScheduleReminderDocument,
  UpdateAppointmentClinicalDocument,
  type AppointmentCalendarPageQuery,
  type AppointmentClinicalFieldsFragment,
} from '@/lib/generated/graphql'
import { formatTime, gqlRequest } from '@/lib/gql'

type CalendarData = AppointmentCalendarPageQuery

type Props = {
  date: string
  initial: CalendarData
}

function shiftDate(iso: string, days: number) {
  const d = new Date(`${iso}T12:00:00`)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export function AppointmentManager({ date, initial }: Props) {
  const router = useRouter()
  const [appointments, setAppointments] = useState(initial.appointmentCalendar)
  const [message, setMessage] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const chairs =
    initial.chairs.length > 0
      ? initial.chairs
      : [
          { id: 'c1', number: 1, name: 'Chair 1', status: 'available' },
          { id: 'c2', number: 2, name: 'Chair 2', status: 'available' },
          { id: 'c3', number: 3, name: 'Chair 3', status: 'available' },
        ]

  async function runMutation(
    id: string,
    fn: () => Promise<AppointmentClinicalFieldsFragment | null | undefined>,
  ) {
    setBusyId(id)
    setMessage(null)
    try {
      const updated = await fn()
      if (updated) {
        setAppointments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
        router.refresh()
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Error')
    } finally {
      setBusyId(null)
    }
  }

  async function cancelAppt(id: string) {
    const reason = window.prompt('Cancel reason (optional)') ?? ''
    await runMutation(id, async () => {
      const data = await gqlRequest(CancelAppointmentDocument, { id, reason: reason || undefined })
      return data.cancelAppointment
    })
  }

  async function markNoShow(id: string) {
    if (!window.confirm('Mark as no-show?')) return
    await runMutation(id, async () => {
      const data = await gqlRequest(MarkAppointmentNoShowDocument, { id })
      return data.markAppointmentNoShow
    })
  }

  async function confirmAppt(id: string) {
    await runMutation(id, async () => {
      const data = await gqlRequest(UpdateAppointmentClinicalDocument, {
        input: { id, status: 'confirmed' },
      })
      return data.updateAppointment
    })
  }

  async function scheduleReminder(appt: AppointmentClinicalFieldsFragment) {
    const recipient = window.prompt('Recipient (phone/email)', appt.patientName ?? '') ?? ''
    if (!recipient) return
    const scheduledAt = `${date}T09:00:00+09:00`
    await runMutation(appt.id, async () => {
      await gqlRequest(ScheduleReminderDocument, {
        input: {
          appointmentId: appt.id,
          channel: 'SMS',
          scheduledAt,
          recipient,
        },
      })
      return appt
    })
    setMessage('Reminder scheduled')
  }

  const byChair = chairs.map((chair) => ({
    chair: chair.number,
    name: chair.name,
    status: chair.status,
    items: appointments.filter((a) => a.chair === chair.number && a.status !== 'cancelled'),
  }))

  return (
    <>
      <div className="calendar-toolbar">
        <Link href={`/appointments?date=${shiftDate(date, -1)}`} className="btn ghost">
          &larr; Prev
        </Link>
        <strong>{date}</strong>
        <Link href={`/appointments?date=${shiftDate(date, 1)}`} className="btn ghost">
          Next &rarr;
        </Link>
        <Link href="/appointments" className="btn ghost">
          Today
        </Link>
      </div>

      {message ? <div className="alert">{message}</div> : null}

      {initial.staffSchedules.length > 0 ? (
        <section className="panel">
          <h3>Staff schedule</h3>
          <table className="data-table compact">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Hours</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {initial.staffSchedules.map((s) => (
                <tr key={s.id}>
                  <td>{s.staffName}</td>
                  <td>{s.role}</td>
                  <td>
                    {s.startTime}-{s.endTime}
                  </td>
                  <td>{s.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : null}

      <div className="split">
        {byChair.map(({ chair, name, status, items }) => (
          <section key={chair} className="panel">
            <h3>
              {name} <span className="muted">({status})</span>
            </h3>
            {items.length === 0 ? (
              <p className="panel-empty">No appointments</p>
            ) : (
              <ul className="appt-list">
                {items.map((a) => (
                  <li key={a.id} className="appt-item">
                    <div className="appt-title">
                      {formatTime(a.startAt)} - {a.patientName}
                    </div>
                    <div className="appt-meta">
                      {a.type} / {a.staff}
                      {a.staffRole ? ` (${a.staffRole})` : null}
                    </div>
                    <div className="appt-badge">
                      <StatusBadge status={a.status} />
                      {a.noShow ? <span className="tag warn">No-show</span> : null}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      {initial.noShowAppointments.length > 0 ? (
        <section className="panel">
          <h3>Past no-shows</h3>
          <ul className="appt-list">
            {initial.noShowAppointments.map((a) => (
              <li key={a.id} className="appt-item muted">
                {a.startAt.slice(0, 10)} {formatTime(a.startAt)} - {a.patientName}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="panel">
        <h3>All appointments</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Start</th>
              <th>End</th>
              <th>Chair</th>
              <th>Patient</th>
              <th>Type</th>
              <th>Staff</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a.id}>
                <td>{formatTime(a.startAt)}</td>
                <td>{formatTime(a.endAt)}</td>
                <td>{a.chair}</td>
                <td>{a.patientName}</td>
                <td>{a.type}</td>
                <td>{a.staff}</td>
                <td>
                  <StatusBadge status={a.status} />
                  {a.cancelReason ? <span className="muted block">{a.cancelReason}</span> : null}
                </td>
                <td className="action-cell">
                  <button
                    type="button"
                    className="btn ghost sm"
                    disabled={busyId === a.id || a.status === 'cancelled'}
                    onClick={() => confirmAppt(a.id)}
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    className="btn ghost sm"
                    disabled={busyId === a.id || a.status === 'cancelled'}
                    onClick={() => scheduleReminder(a)}
                  >
                    Remind
                  </button>
                  <button
                    type="button"
                    className="btn ghost sm"
                    disabled={busyId === a.id || a.status === 'cancelled'}
                    onClick={() => markNoShow(a.id)}
                  >
                    NS
                  </button>
                  <button
                    type="button"
                    className="btn ghost sm danger"
                    disabled={busyId === a.id || a.status === 'cancelled'}
                    onClick={() => cancelAppt(a.id)}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  )
}
