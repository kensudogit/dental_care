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

  const chairs = initial.chairs.length > 0 ? initial.chairs : [
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
    const reason = window.prompt('\u30ad\u30e3\u30f3\u30bb\u30eb\u7406\u7531\uff08\u4efb\u610f\uff09') ?? ''
    await runMutation(id, async () => {
      const data = await gqlRequest(CancelAppointmentDocument, { id, reason: reason || undefined })
      return data.cancelAppointment
    })
  }

  async function markNoShow(id: string) {
    if (!window.confirm('\u30ce\u30fc\u30b7\u30e7\u30fc\u306b\u3057\u307e\u3059\u304b\uff1f')) return
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
    const recipient = window.prompt('\u9001\u4fe1\u5148\uff08\u96fb\u8a71/\u30e1\u30fc\u30eb\uff09', appt.patientName ?? '') ?? ''
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
    setMessage('\u30ea\u30de\u30a4\u30f3\u30c0\u3092\u767b\u9332\u3057\u307e\u3057\u305f')
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
          &larr; \u524d\u65e5
        </Link>
        <strong>{date}</strong>
        <Link href={`/appointments?date=${shiftDate(date, 1)}`} className="btn ghost">
          \u6b21\u65e5 &rarr;
        </Link>
        <Link href="/appointments" className="btn ghost">
          \u672c\u65e5
        </Link>
      </div>

      {message ? <div className="alert">{message}</div> : null}

      {initial.staffSchedules.length > 0 ? (
        <section className="panel">
          <h3>\u30b9\u30bf\u30c3\u30d5\u52e4\u52d9</h3>
          <table className="data-table compact">
            <thead>
              <tr>
                <th>\u540d\u524d</th>
                <th>\u5f79\u5272</th>
                <th>\u6642\u9593</th>
                <th>\u5099\u8003</th>
              </tr>
            </thead>
            <tbody>
              {initial.staffSchedules.map((s) => (
                <tr key={s.id}>
                  <td>{s.staffName}</td>
                  <td>{s.role}</td>
                  <td>
                    {s.startTime}\u2013{s.endTime}
                  </td>
                  <td>{s.notes || '\u2014'}</td>
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
              <p className="panel-empty">\u4e88\u7d04\u306a\u3057</p>
            ) : (
              <ul className="appt-list">
                {items.map((a) => (
                  <li key={a.id} className="appt-item">
                    <div className="appt-title">
                      {formatTime(a.startAt)} \u2014 {a.patientName}
                    </div>
                    <div className="appt-meta">
                      {a.type} \u00b7 {a.staff} ({a.staffRole})
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
          <h3>\u904e\u53bb\u306e\u30ce\u30fc\u30b7\u30e7\u30fc</h3>
          <ul className="appt-list">
            {initial.noShowAppointments.map((a) => (
              <li key={a.id} className="appt-item muted">
                {a.startAt.slice(0, 10)} {formatTime(a.startAt)} \u2014 {a.patientName}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="panel">
        <h3>\u4e88\u7d04\u4e00\u89a7</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>\u958b\u59cb</th>
              <th>\u7d42\u4e86</th>
              <th>\u30c1\u30a7\u30a2</th>
              <th>\u60a3\u8005</th>
              <th>\u7a2e\u5225</th>
              <th>\u62c5\u5f53</th>
              <th>\u72b6\u614b</th>
              <th>\u64cd\u4f5c</th>
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
                  {a.cancelReason ? (
                    <span className="muted block">{a.cancelReason}</span>
                  ) : null}
                </td>
                <td className="action-cell">
                  <button
                    type="button"
                    className="btn ghost sm"
                    disabled={busyId === a.id || a.status === 'cancelled'}
                    onClick={() => confirmAppt(a.id)}
                  >
                    \u78ba\u8a8d
                  </button>
                  <button
                    type="button"
                    className="btn ghost sm"
                    disabled={busyId === a.id || a.status === 'cancelled'}
                    onClick={() => scheduleReminder(a)}
                  >
                    \u30ea\u30de\u30a4\u30f3\u30c0
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
                    \u30ad\u30e3\u30f3\u30bb\u30eb
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
