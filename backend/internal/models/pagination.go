package models

type PageInfo struct {
	Total      int `json:"total"`
	Page       int `json:"page"`
	PageSize   int `json:"pageSize"`
	TotalPages int `json:"totalPages"`
}

type PatientPage struct {
	Items    []Patient `json:"items"`
	PageInfo PageInfo  `json:"pageInfo"`
}

type AppointmentPage struct {
	Items    []Appointment `json:"items"`
	PageInfo PageInfo      `json:"pageInfo"`
}

type TreatmentPage struct {
	Items    []TreatmentRecord `json:"items"`
	PageInfo PageInfo          `json:"pageInfo"`
}

type AuditLogPage struct {
	Items    []AuditLogEntry `json:"items"`
	PageInfo PageInfo        `json:"pageInfo"`
}
