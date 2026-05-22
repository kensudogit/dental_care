package models

import "time"

type Patient struct {
	ID          string    `json:"id"`
	ChartNo     string    `json:"chartNo"`
	Name        string    `json:"name"`
	Kana        string    `json:"kana"`
	BirthDate   string    `json:"birthDate"`
	Phone       string    `json:"phone"`
	Email       string    `json:"email"`
	Allergies   string    `json:"allergies"`
	Notes       string    `json:"notes"`
	LastVisit   string    `json:"lastVisit"`
	CreatedAt   time.Time `json:"createdAt"`
}

type Appointment struct {
	ID        string `json:"id"`
	PatientID string `json:"patientId"`
	Patient   string `json:"patientName,omitempty"`
	Chair     int    `json:"chair"`
	StartAt   string `json:"startAt"`
	EndAt     string `json:"endAt"`
	Type      string `json:"type"`
	Status    string `json:"status"`
	Staff     string `json:"staff"`
	Notes     string `json:"notes"`
}

type TreatmentRecord struct {
	ID          string   `json:"id"`
	PatientID   string   `json:"patientId"`
	PatientName string   `json:"patientName,omitempty"`
	VisitDate   string   `json:"visitDate"`
	Tooth       string   `json:"tooth"`
	Procedure   string   `json:"procedure"`
	Diagnosis   string   `json:"diagnosis"`
	Fee         int      `json:"fee"`
	Staff       string   `json:"staff"`
	Status      string   `json:"status"`
	Tags        []string `json:"tags"`
}

type DashboardStats struct {
	PatientsTotal      int     `json:"patientsTotal"`
	AppointmentsToday  int     `json:"appointmentsToday"`
	TreatmentsThisMonth int    `json:"treatmentsThisMonth"`
	RevenueThisMonth   int     `json:"revenueThisMonth"`
	ChairUtilization   float64 `json:"chairUtilization"`
	NoShowRate         float64 `json:"noShowRate"`
}

type HealthResponse struct {
	OK      bool   `json:"ok"`
	Service string `json:"service"`
	Version string `json:"version"`
}
