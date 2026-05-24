import { isoNow, slicePage, todayISO } from './helpers'

type Patient = {
  id: string
  chartNo: string
  name: string
  kana: string
  birthDate: string
  phone: string
  email: string
  allergies: string
  notes: string
  lastVisit: string
  createdAt: string
}

type Appointment = {
  id: string
  patientId: string
  patientName: string
  chair: number
  startAt: string
  endAt: string
  type: string
  status: string
  staff: string
  staffRole: string
  notes: string
  noShow: boolean
  cancelReason?: string | null
  cancelledAt?: string | null
}

type Treatment = {
  id: string
  patientId: string
  patientName: string
  visitDate: string
  tooth: string
  procedure: string
  procedureCode: string
  diagnosis: string
  fee: number
  staff: string
  status: string
  tags: string[]
  subjective: string
  objective: string
  assessment: string
  plan: string
  toothChartJson: string
}

type PerioSite = {
  tooth: string
  pdMesial: number
  pdBuccal: number
  pdDistal: number
  pdLingual: number
  bop: boolean
  mobility: number
}

type PerioExam = {
  id: string
  patientId: string
  examDate: string
  staff: string
  notes: string
  sites: PerioSite[]
  createdAt: string
}

class EmbeddedStore {
  patients: Patient[] = []
  appointments: Appointment[] = []
  treatments: Treatment[] = []
  xrays: Array<{
    id: string
    patientId: string
    title: string
    imageUrl: string
    imageType: string
    toothRegion: string
    takenAt: string
    notes: string
    createdAt: string
    updatedAt: string
  }> = []
  perioExams: PerioExam[] = []

  auditLogs = [
    {
      id: 'log1',
      action: 'member.invited',
      resource: 'team',
      actorName: 'Kimura',
      ipAddress: '203.0.113.10',
      metadata: '{"email":"sato@sakura-dental.jp","role":"MEMBER"}',
      createdAt: isoNow(),
    },
  ]

  constructor() {
    this.seed()
  }

  private seed() {
    const today = todayISO()
    const created = isoNow()

    this.patients = [
      { id: 'p1', chartNo: '10001', name: '\u5c71\u7530 \u592a\u90ce', kana: '\u30e4\u30de\u30c0 \u30bf\u30ed\u30a6', birthDate: '1985-03-12', phone: '090-1234-5678', email: 'taro@example.com', allergies: '\u30da\u30cb\u30b7\u30ea\u30f3', notes: '\u5b9a\u671f\u691c\u8a3a\u5e0c\u671b', lastVisit: '2026-05-10', createdAt: created },
      { id: 'p2', chartNo: '10002', name: '\u4f50\u85e4 \u82b1\u5b50', kana: '\u30b5\u30c8\u30a6 \u30cf\u30ca\u30b3', birthDate: '1992-07-22', phone: '080-9876-5432', email: 'hanako@example.com', allergies: '', notes: '\u77ef\u6b63\u76f8\u8ac7\u6e08', lastVisit: '2026-05-15', createdAt: created },
      { id: 'p3', chartNo: '10003', name: '\u9234\u6728 \u4e00\u90ce', kana: '\u30b9\u30ba\u30ad \u30a4\u30c1\u30ed\u30a6', birthDate: '1978-11-05', phone: '070-1111-2222', email: '', allergies: '\u30e9\u30c6\u30c3\u30af\u30b9', notes: '', lastVisit: '2026-04-28', createdAt: created },
      { id: 'p4', chartNo: '10004', name: '\u7530\u4e2d \u7f8e\u54b2', kana: '\u30bf\u30ca\u30ab \u30df\u30b5\u30ad', birthDate: '2001-01-18', phone: '090-3333-4444', email: 'misaki@example.com', allergies: '', notes: '\u5b66\u751f\u5272\u5f15\u5bfe\u8c61', lastVisit: '2026-05-18', createdAt: created },
      { id: 'p5', chartNo: '10005', name: '\u4f0a\u85e4 \u7fd4', kana: '\u30a4\u30c8\u30a6 \u30b7\u30e7\u30a6', birthDate: '1990-06-08', phone: '090-2222-3333', email: 'sho@example.com', allergies: '', notes: '', lastVisit: '2026-05-01', createdAt: created },
      { id: 'p6', chartNo: '10006', name: '\u6e21\u8fba \u7531\u7f8e', kana: '\u30ef\u30bf\u30ca\u30d9 \u30e6\u30df', birthDate: '1988-12-20', phone: '080-4444-5555', email: '', allergies: '\u30a4\u30d6\u30d7\u30ed\u30d5\u30a7\u30f3', notes: '', lastVisit: '2026-04-15', createdAt: created },
      { id: 'p7', chartNo: '10007', name: '\u4e2d\u6751 \u5927\u8f14', kana: '\u30ca\u30ab\u30e0\u30e9 \u30c0\u30a4\u30b9\u30b1', birthDate: '1975-09-03', phone: '070-6666-7777', email: 'daisuke@example.com', allergies: '', notes: '\u30a4\u30f3\u30d7\u30e9\u30f3\u30c8\u76f8\u8ac7', lastVisit: '2026-03-22', createdAt: created },
      { id: 'p8', chartNo: '10008', name: '\u5c0f\u6797 \u3042\u3086\u307f', kana: '\u30b3\u30d0\u30e4\u30b7 \u30a2\u30e6\u30df', birthDate: '1998-02-14', phone: '090-8888-9999', email: 'ayumi@example.com', allergies: '', notes: '', lastVisit: '2026-05-12', createdAt: created },
    ]

    this.appointments = [
      { id: 'a1', patientId: 'p1', patientName: '\u5c71\u7530 \u592a\u90ce', chair: 1, startAt: `${today}T09:00:00`, endAt: `${today}T09:30:00`, type: '\u5b9a\u671f\u691c\u8a3a', status: 'confirmed', staff: 'Dr. \u6728\u6751', staffRole: 'dentist', notes: '', noShow: false },
      { id: 'a2', patientId: 'p2', patientName: '\u4f50\u85e4 \u82b1\u5b50', chair: 2, startAt: `${today}T10:00:00`, endAt: `${today}T11:00:00`, type: '\u77ef\u6b63\u8abf\u6574', status: 'confirmed', staff: 'Dr. \u6728\u6751', staffRole: 'dentist', notes: '\u30ef\u30a4\u30e4\u30fc\u4ea4\u63db', noShow: false },
      { id: 'a3', patientId: 'p4', patientName: '\u7530\u4e2d \u7f8e\u54b2', chair: 1, startAt: `${today}T11:30:00`, endAt: `${today}T12:00:00`, type: '\u30af\u30ea\u30fc\u30cb\u30f3\u30b0', status: 'pending', staff: '\u885b\u751f\u58eb \u6797', staffRole: 'hygienist', notes: '', noShow: false },
      { id: 'a4', patientId: 'p3', patientName: '\u9234\u6728 \u4e00\u90ce', chair: 3, startAt: `${today}T14:00:00`, endAt: `${today}T15:00:00`, type: 'CR\u5145\u586b', status: 'confirmed', staff: 'Dr. \u6728\u6751', staffRole: 'dentist', notes: '#16', noShow: false },
    ]

    this.treatments = [
      { id: 't1', patientId: 'p1', patientName: '\u5c71\u7530 \u592a\u90ce', visitDate: '2026-05-10', tooth: '16', procedure: '\u30b9\u30b1\u30fc\u30ea\u30f3\u30b0', procedureCode: 'M011', diagnosis: '\u6b6f\u77f3\u6c89\u7740', fee: 3300, staff: '\u885b\u751f\u58eb \u6797', status: 'completed', tags: ['\u4e88\u9632'], subjective: '\u6b6f\u78da\u304c\u306a\u3064\u304b\u3057\u3044', objective: '\u6b6f\u77f3\u9644\u7740', assessment: '\u6b6f\u77f3\u6c89\u7740', plan: '\u30b9\u30b1\u30fc\u30ea\u30f3\u30b0', toothChartJson: '{"selected":["16"],"conditions":{"16":"calculus"}}' },
      { id: 't2', patientId: 'p2', patientName: '\u4f50\u85e4 \u82b1\u5b50', visitDate: '2026-05-15', tooth: '\u5168\u4f53', procedure: '\u77ef\u6b63\u8abf\u6574', procedureCode: 'M301', diagnosis: '\u53c2\u751f', fee: 8800, staff: 'Dr. \u6728\u6751', status: 'completed', tags: ['\u77ef\u6b63'], subjective: '', objective: '', assessment: '', plan: '', toothChartJson: '{"selected":[],"conditions":{}}' },
      { id: 't3', patientId: 'p3', patientName: '\u9234\u6728 \u4e00\u90ce', visitDate: '2026-04-28', tooth: '26', procedure: '\u6839\u7ba1\u6cbb\u7642', procedureCode: 'M012', diagnosis: '\u6b6f\u9ad3\u708e', fee: 12000, staff: 'Dr. \u6728\u6751', status: 'in_progress', tags: ['\u4fdd\u5b58'], subjective: '', objective: '', assessment: '', plan: '', toothChartJson: '{"selected":["26"],"conditions":{"26":"endo"}}' },
      { id: 't4', patientId: 'p4', patientName: '\u7530\u4e2d \u7f8e\u54b2', visitDate: '2026-05-18', tooth: '\u5168\u4f53', procedure: 'PMTC', procedureCode: 'M401', diagnosis: '\u8efd\u5ea6\u6b6f\u5468\u75c5', fee: 5500, staff: '\u885b\u751f\u58eb \u6797', status: 'completed', tags: ['\u4e88\u9632', '\u6b6f\u5468'], subjective: '', objective: '', assessment: '', plan: '', toothChartJson: '{"selected":[],"conditions":{}}' },
    ]

    this.xrays = [
      { id: 'x1', patientId: 'p1', title: 'Panoramic', imageUrl: '/uploads/xrays/placeholder.svg', imageType: 'PANORAMIC', toothRegion: '\u5168\u4f53', takenAt: '2026-05-10', notes: '', createdAt: created, updatedAt: created },
      { id: 'x2', patientId: 'p1', title: '\u53e3\u8154\u5185\u7167', imageUrl: '/uploads/xrays/placeholder.svg', imageType: 'INTRAORAL', toothRegion: '16', takenAt: '2026-05-10', notes: '', createdAt: created, updatedAt: created },
    ]

    this.perioExams = [
      {
        id: 'pe1', patientId: 'p1', examDate: '2026-05-10', staff: '\u885b\u751f\u58eb \u6797', notes: '\u521d\u56de\u691c\u67fb', createdAt: created,
        sites: [{ tooth: '16', pdMesial: 2, pdBuccal: 3, pdDistal: 2, pdLingual: 2, bop: true, mobility: 0 }],
      },
    ]
  }

  dashboard() {
    const today = todayISO()
    const apptToday = this.appointments.filter((a) => a.startAt.startsWith(today)).length
    const revenue = this.treatments.reduce((s, t) => s + t.fee, 0)
    return {
      patientsTotal: this.patients.length,
      appointmentsToday: apptToday,
      treatmentsThisMonth: this.treatments.length,
      revenueThisMonth: revenue,
      chairUtilization: 0.72,
      noShowRate: 0.05,
    }
  }

  paginatePatients(page?: number, pageSize?: number) {
    const sorted = [...this.patients].sort((a, b) => a.chartNo.localeCompare(b.chartNo))
    return slicePage(sorted, page, pageSize)
  }

  patient(id: string) {
    return this.patients.find((p) => p.id === id) ?? null
  }

  paginateAppointments(date?: string, page?: number, pageSize?: number) {
    const today = date || todayISO()
    const filtered = this.appointments
      .filter((a) => a.startAt.slice(0, 10) === today)
      .sort((a, b) => a.startAt.localeCompare(b.startAt))
    return slicePage(filtered, page, pageSize)
  }

  paginateTreatments(patientId?: string, page?: number, pageSize?: number) {
    const filtered = this.treatments.filter((t) => !patientId || t.patientId === patientId)
    return slicePage(filtered, page, pageSize)
  }

  treatment(id: string) {
    return this.treatments.find((t) => t.id === id) ?? null
  }

  createTreatment(input: Omit<Treatment, 'id' | 'patientName'>) {
    const patient = this.patient(input.patientId)
    const record: Treatment = {
      ...input,
      id: `t${Date.now()}`,
      patientName: patient?.name ?? '',
      procedureCode: input.procedureCode ?? '',
      subjective: input.subjective ?? '',
      objective: input.objective ?? '',
      assessment: input.assessment ?? '',
      plan: input.plan ?? '',
      toothChartJson: input.toothChartJson ?? '{"selected":[],"conditions":{}}',
      tags: input.tags ?? [],
    }
    this.treatments.unshift(record)
    return record
  }

  updateTreatment(id: string, patch: Partial<Treatment>) {
    const idx = this.treatments.findIndex((t) => t.id === id)
    if (idx < 0) return null
    this.treatments[idx] = { ...this.treatments[idx], ...patch, id }
    return this.treatments[idx]
  }

  deleteTreatment(id: string) {
    const idx = this.treatments.findIndex((t) => t.id === id)
    if (idx < 0) return null
    const [removed] = this.treatments.splice(idx, 1)
    return removed
  }

  appointmentCalendar(from: string, to: string) {
    return this.appointments.filter((a) => {
      const d = a.startAt.slice(0, 10)
      return d >= from && d <= to
    })
  }

  chairs() {
    return [
      { id: 'c1', number: 1, name: 'Chair 1', status: 'available' },
      { id: 'c2', number: 2, name: 'Chair 2', status: 'available' },
      { id: 'c3', number: 3, name: 'Chair 3', status: 'available' },
    ]
  }

  staffSchedules(date?: string) {
    const d = date || todayISO()
    return [
      { id: 'ss1', staffName: 'Dr. Kimura', role: 'dentist', date: d, startTime: '09:00', endTime: '18:00', notes: '' },
      { id: 'ss2', staffName: 'Hygienist Hayashi', role: 'hygienist', date: d, startTime: '09:00', endTime: '17:00', notes: 'PMTC' },
    ]
  }

  noShowAppointments() {
    return this.appointments.filter((a) => a.noShow || a.status === 'no_show')
  }

  patientProfile(id: string) {
    const p = this.patient(id)
    if (!p) return null
    return {
      ...p,
      gender: 'male',
      address: 'Tokyo',
      insurance: {
        insurerName: 'Kenpo',
        symbol: '1234',
        number: '567890',
        copayCategory: '30%',
        validUntil: '2027-03-31',
      },
      medicalHistories: [],
      allergyRecords: [],
      familyMembers: [],
      questionnaires: [],
      emergencyContacts: [],
      visitHistory: [],
    }
  }

  xrayImages(patientId?: string) {
    return this.xrays.filter((x) => !patientId || x.patientId === patientId)
  }

  perioExamsForPatient(patientId: string) {
    return this.perioExams.filter((e) => e.patientId === patientId)
  }

  createPerioExam(input: Omit<PerioExam, 'id' | 'createdAt'>) {
    const record: PerioExam = {
      id: `pe${Date.now()}`,
      createdAt: isoNow(),
      ...input,
      sites: input.sites ?? [],
    }
    this.perioExams.unshift(record)
    return record
  }

  updatePerioExam(id: string, patch: Partial<PerioExam>) {
    const idx = this.perioExams.findIndex((e) => e.id === id)
    if (idx < 0) return null
    this.perioExams[idx] = { ...this.perioExams[idx], ...patch, id }
    return this.perioExams[idx]
  }

  deletePerioExam(id: string) {
    const idx = this.perioExams.findIndex((e) => e.id === id)
    if (idx < 0) return null
    const [removed] = this.perioExams.splice(idx, 1)
    return removed
  }

  paginateAuditLogs(page?: number, pageSize?: number) {
    return slicePage(this.auditLogs, page, pageSize ?? 20)
  }

  session() {
    return {
      user: { id: 'u1', email: 'kimura@sakura-dental.jp', name: 'Kimura' },
      organization: {
        id: 'org_demo',
        name: 'Sakura Dental',
        slug: 'sakura-dental',
        planTier: 'PRO',
        subscriptionStatus: 'ACTIVE',
        chairCount: 3,
        memberCount: 4,
      },
      role: 'OWNER',
    }
  }

  organization() {
    return {
      id: 'org_demo',
      name: 'Sakura Dental',
      slug: 'sakura-dental',
      planTier: 'PRO',
      subscriptionStatus: 'ACTIVE',
      chairCount: 3,
      timezone: 'Asia/Tokyo',
      memberCount: 4,
      createdAt: isoNow(),
    }
  }

  usage() {
    return {
      members: 4,
      membersLimit: 20,
      patients: this.patients.length,
      patientsLimit: 500,
      apiCallsThisMonth: 1200,
      apiCallsLimit: 50000,
    }
  }

  teamMembers() {
    return [
      { id: 'm1', role: 'OWNER', joinedAt: isoNow(), lastActiveAt: isoNow(), user: { id: 'u1', email: 'kimura@sakura-dental.jp', name: 'Kimura' } },
      { id: 'm2', role: 'ADMIN', joinedAt: isoNow(), lastActiveAt: isoNow(), user: { id: 'u2', email: 'hayashi@sakura-dental.jp', name: 'Hayashi' } },
    ]
  }

  subscriptionPlans() {
    return [
      { tier: 'STARTER', name: 'Starter', priceMonthly: 9800, priceYearly: 98000, maxMembers: 5, maxPatients: 100, features: [] },
      { tier: 'PRO', name: 'Pro', priceMonthly: 29800, priceYearly: 298000, maxMembers: 20, maxPatients: 500, features: [] },
    ]
  }

  apiKeys() {
    return [{ id: 'key1', name: 'Production', prefix: 'dc_live_', lastUsedAt: null, createdAt: isoNow() }]
  }
}

let singleton: EmbeddedStore | null = null

export function getEmbeddedStore() {
  if (!singleton) singleton = new EmbeddedStore()
  return singleton
}
