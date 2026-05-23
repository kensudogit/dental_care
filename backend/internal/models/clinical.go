package models

type InsuranceInfo struct {
	PatientID     string `json:"patientId"`
	InsurerName   string `json:"insurerName"`
	Symbol        string `json:"symbol"`
	Number        string `json:"number"`
	CopayCategory string `json:"copayCategory"`
	ValidUntil    string `json:"validUntil"`
}

type MedicalHistory struct {
	ID          string `json:"id"`
	PatientID   string `json:"patientId"`
	Condition   string `json:"condition"`
	DiagnosedAt string `json:"diagnosedAt"`
	Notes       string `json:"notes"`
	Resolved    bool   `json:"resolved"`
}

type AllergyRecord struct {
	ID        string `json:"id"`
	PatientID string `json:"patientId"`
	Substance string `json:"substance"`
	Severity  string `json:"severity"`
	Reaction  string `json:"reaction"`
}

type FamilyMember struct {
	ID              string `json:"id"`
	PatientID       string `json:"patientId"`
	Name            string `json:"name"`
	Relationship    string `json:"relationship"`
	Phone           string `json:"phone"`
	LinkedPatientID string `json:"linkedPatientId,omitempty"`
}

type Questionnaire struct {
	ID                 string `json:"id"`
	PatientID          string `json:"patientId"`
	SubmittedAt        string `json:"submittedAt"`
	ChiefComplaint     string `json:"chiefComplaint"`
	CurrentMedications string `json:"currentMedications"`
	Smoking            bool   `json:"smoking"`
	Pregnancy          bool   `json:"pregnancy"`
	DentalAnxiety      int    `json:"dentalAnxiety"`
	Notes              string `json:"notes"`
}

type EmergencyContact struct {
	ID           string `json:"id"`
	PatientID    string `json:"patientId"`
	Name         string `json:"name"`
	Relationship string `json:"relationship"`
	Phone        string `json:"phone"`
	Priority     int    `json:"priority"`
}

type VisitRecord struct {
	ID        string `json:"id"`
	PatientID string `json:"patientId"`
	VisitDate string `json:"visitDate"`
	VisitType string `json:"visitType"`
	Summary   string `json:"summary"`
	Staff     string `json:"staff"`
	Status    string `json:"status"`
}

type PatientProfile struct {
	Patient
	Gender  string `json:"gender"`
	Address string `json:"address"`
}

type Chair struct {
	ID     string `json:"id"`
	Number int    `json:"number"`
	Name   string `json:"name"`
	Status string `json:"status"`
}

type StaffSchedule struct {
	ID        string `json:"id"`
	StaffID   string `json:"staffId"`
	StaffName string `json:"staffName"`
	Role      string `json:"role"`
	Date      string `json:"date"`
	StartTime string `json:"startTime"`
	EndTime   string `json:"endTime"`
	Notes     string `json:"notes"`
}

type ReminderChannel string

const (
	ReminderSMS   ReminderChannel = "SMS"
	ReminderEmail ReminderChannel = "EMAIL"
	ReminderLINE  ReminderChannel = "LINE"
)

type ReminderNotification struct {
	ID            string          `json:"id"`
	AppointmentID string          `json:"appointmentId"`
	Channel       ReminderChannel `json:"channel"`
	ScheduledAt   string          `json:"scheduledAt"`
	Status        string          `json:"status"`
	SentAt        string          `json:"sentAt,omitempty"`
	Recipient     string          `json:"recipient"`
}
