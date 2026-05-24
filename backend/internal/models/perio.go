package models

import "time"

type PerioSite struct {
	Tooth    string `json:"tooth"`
	PDMesial int    `json:"pdMesial"`
	PDBuccal int    `json:"pdBuccal"`
	PDDistal int    `json:"pdDistal"`
	PDLingual int   `json:"pdLingual"`
	BOP      bool   `json:"bop"`
	Mobility int    `json:"mobility"`
}

type PerioExam struct {
	ID        string      `json:"id"`
	PatientID string      `json:"patientId"`
	ExamDate  string      `json:"examDate"`
	Staff     string      `json:"staff"`
	Notes     string      `json:"notes"`
	Sites     []PerioSite `json:"sites"`
	CreatedAt time.Time   `json:"createdAt"`
}
