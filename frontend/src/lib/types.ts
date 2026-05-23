export type Patient = {
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

export type Appointment = {
  id: string
  patientId: string
  patientName?: string
  chair: number
  startAt: string
  endAt: string
  type: string
  status: string
  staff: string
  notes: string
}

export type TreatmentRecord = {
  id: string
  patientId: string
  patientName?: string
  visitDate: string
  tooth: string
  procedure: string
  diagnosis: string
  fee: number
  staff: string
  status: string
  tags: string[]
}

export type DashboardStats = {
  patientsTotal: number
  appointmentsToday: number
  treatmentsThisMonth: number
  revenueThisMonth: number
  chairUtilization: number
  noShowRate: number
}
