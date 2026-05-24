package graph

import (
	"strconv"
	"time"

	"github.com/graphql-go/graphql"
	"github.com/pluszero/dental-care-api/internal/models"
	"github.com/pluszero/dental-care-api/internal/store"
)

type Resolver struct {
	store *store.Store
}

func (r *Resolver) Health(p graphql.ResolveParams) (any, error) {
	return map[string]any{
		"ok":      true,
		"service": "dental-care-api",
		"version": "2.0.0-graphql",
	}, nil
}

func (r *Resolver) Dashboard(p graphql.ResolveParams) (any, error) {
	d := r.store.Dashboard()
	return map[string]any{
		"patientsTotal":       d.PatientsTotal,
		"appointmentsToday":   d.AppointmentsToday,
		"treatmentsThisMonth": d.TreatmentsThisMonth,
		"revenueThisMonth":    d.RevenueThisMonth,
		"chairUtilization":    d.ChairUtilization,
		"noShowRate":          d.NoShowRate,
	}, nil
}

func (r *Resolver) Patients(p graphql.ResolveParams) (any, error) {
	page, pageSize := pageFromArgs(p)
	result := r.store.PaginatePatients(page, pageSize)
	items := make([]map[string]any, 0, len(result.Items))
	for _, pt := range result.Items {
		items = append(items, patientToMap(pt))
	}
	pi := result.PageInfo
	return pageResult(items, pi.Total, pi.Page, pi.PageSize, pi.TotalPages), nil
}

func (r *Resolver) Patient(p graphql.ResolveParams) (any, error) {
	id, _ := p.Args["id"].(string)
	pt, ok := r.store.GetPatient(id)
	if !ok {
		return nil, nil
	}
	m := patientToMap(pt)
	return m, nil
}

func (r *Resolver) Appointments(p graphql.ResolveParams) (any, error) {
	date, _ := p.Args["date"].(string)
	if date == "" {
		date = time.Now().Format("2006-01-02")
	}
	page, pageSize := pageFromArgs(p)
	result := r.store.PaginateAppointments(date, page, pageSize)
	items := make([]map[string]any, 0, len(result.Items))
	for _, a := range result.Items {
		items = append(items, appointmentToMapFull(a))
	}
	pi := result.PageInfo
	return pageResult(items, pi.Total, pi.Page, pi.PageSize, pi.TotalPages), nil
}

func (r *Resolver) Treatments(p graphql.ResolveParams) (any, error) {
	pid, _ := p.Args["patientId"].(string)
	page, pageSize := pageFromArgs(p)
	result := r.store.PaginateTreatments(pid, page, pageSize)
	items := make([]map[string]any, 0, len(result.Items))
	for _, t := range result.Items {
		items = append(items, treatmentToMap(t))
	}
	pi := result.PageInfo
	return pageResult(items, pi.Total, pi.Page, pi.PageSize, pi.TotalPages), nil
}

func (r *Resolver) CreatePatient(p graphql.ResolveParams) (any, error) {
	in, _ := p.Args["input"].(map[string]any)
	pt := models.Patient{
		ID:        "p" + strconv.FormatInt(time.Now().UnixNano(), 10),
		ChartNo:   str(in, "chartNo"),
		Name:      str(in, "name"),
		Kana:      str(in, "kana"),
		BirthDate: str(in, "birthDate"),
		Phone:     str(in, "phone"),
		Email:     str(in, "email"),
		Allergies: str(in, "allergies"),
		Notes:     str(in, "notes"),
		LastVisit: str(in, "lastVisit"),
	}
	if pt.ChartNo == "" {
		pt.ChartNo = pt.ID
	}
	created := r.store.CreatePatient(pt)
	return patientToMap(created), nil
}

func (r *Resolver) CreateAppointment(p graphql.ResolveParams) (any, error) {
	in, _ := p.Args["input"].(map[string]any)
	status := str(in, "status")
	if status == "" {
		status = "pending"
	}
	a := models.Appointment{
		ID:        "a" + strconv.FormatInt(time.Now().UnixNano(), 10),
		PatientID: str(in, "patientId"),
		Chair:     toInt(in["chair"]),
		StartAt:   str(in, "startAt"),
		EndAt:     str(in, "endAt"),
		Type:      str(in, "type"),
		Status:    status,
		Staff:     str(in, "staff"),
		Notes:     str(in, "notes"),
	}
	created := r.store.CreateAppointment(a)
	return appointmentToMapFull(created), nil
}

func toInt(v any) int {
	switch n := v.(type) {
	case int:
		return n
	case int32:
		return int(n)
	case int64:
		return int(n)
	case float64:
		return int(n)
	default:
		return 0
	}
}

func str(m map[string]any, key string) string {
	if v, ok := m[key].(string); ok {
		return v
	}
	return ""
}

func patientToMap(p models.Patient) map[string]any {
	return map[string]any{
		"id": p.ID, "chartNo": p.ChartNo, "name": p.Name, "kana": p.Kana,
		"birthDate": p.BirthDate, "phone": p.Phone, "email": p.Email,
		"allergies": p.Allergies, "notes": p.Notes, "lastVisit": p.LastVisit,
		"createdAt": p.CreatedAt.Format(time.RFC3339),
	}
}

func appointmentToMap(a models.Appointment) map[string]any {
	return map[string]any{
		"id": a.ID, "patientId": a.PatientID, "patientName": a.Patient,
		"chair": a.Chair, "startAt": a.StartAt, "endAt": a.EndAt,
		"type": a.Type, "status": a.Status, "staff": a.Staff, "notes": a.Notes,
	}
}

func treatmentToMap(t models.TreatmentRecord) map[string]any {
	tags := t.Tags
	if tags == nil {
		tags = []string{}
	}
	toothChart := t.ToothChartJSON
	if toothChart == "" {
		toothChart = `{"selected":[],"conditions":{}}`
	}
	return map[string]any{
		"id": t.ID, "patientId": t.PatientID, "patientName": t.PatientName,
		"visitDate": t.VisitDate, "tooth": t.Tooth, "procedure": t.Procedure,
		"procedureCode": t.ProcedureCode, "diagnosis": t.Diagnosis, "fee": t.Fee,
		"staff": t.Staff, "status": t.Status, "tags": tags,
		"subjective": t.Subjective, "objective": t.Objective,
		"assessment": t.Assessment, "plan": t.Plan, "toothChartJson": toothChart,
	}
}
