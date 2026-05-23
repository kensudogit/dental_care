package graph

import (
	"github.com/graphql-go/graphql"
	"github.com/pluszero/dental-care-api/internal/models"
)

func (r *Resolver) PatientProfile(p graphql.ResolveParams) (any, error) {
	id, _ := p.Args["id"].(string)
	prof, ok := r.store.GetPatientProfile(id)
	if !ok {
		return nil, nil
	}
	return patientProfileToMap(r, prof), nil
}

func (r *Resolver) SearchPatients(p graphql.ResolveParams) (any, error) {
	q, _ := p.Args["query"].(string)
	out := make([]map[string]any, 0)
	for _, pt := range r.store.SearchPatients(q) {
		if prof, ok := r.store.GetPatientProfile(pt.ID); ok {
			out = append(out, patientProfileToMap(r, prof))
		}
	}
	return out, nil
}

func (r *Resolver) Chairs(p graphql.ResolveParams) (any, error) {
	out := make([]map[string]any, 0)
	for _, c := range r.store.ListChairs() {
		out = append(out, map[string]any{
			"id": c.ID, "number": c.Number, "name": c.Name, "status": c.Status,
		})
	}
	return out, nil
}

func (r *Resolver) StaffSchedules(p graphql.ResolveParams) (any, error) {
	date, _ := p.Args["date"].(string)
	out := make([]map[string]any, 0)
	for _, ss := range r.store.ListStaffSchedules(date) {
		out = append(out, map[string]any{
			"id": ss.ID, "staffId": ss.StaffID, "staffName": ss.StaffName,
			"role": ss.Role, "date": ss.Date, "startTime": ss.StartTime,
			"endTime": ss.EndTime, "notes": ss.Notes,
		})
	}
	return out, nil
}

func (r *Resolver) AppointmentCalendar(p graphql.ResolveParams) (any, error) {
	from, _ := p.Args["from"].(string)
	to, _ := p.Args["to"].(string)
	out := make([]map[string]any, 0)
	for _, a := range r.store.ListAppointmentsRange(from, to) {
		out = append(out, appointmentToMapFull(a))
	}
	return out, nil
}

func (r *Resolver) NoShowAppointments(p graphql.ResolveParams) (any, error) {
	out := make([]map[string]any, 0)
	for _, a := range r.store.ListNoShowAppointments() {
		out = append(out, appointmentToMapFull(a))
	}
	return out, nil
}

func (r *Resolver) UpdatePatientProfile(p graphql.ResolveParams) (any, error) {
	in, _ := p.Args["input"].(map[string]any)
	prof, err := r.store.UpdatePatientProfile(
		str(in, "id"), str(in, "gender"), str(in, "address"),
		str(in, "phone"), str(in, "email"), str(in, "notes"),
	)
	if err != nil {
		return nil, gqlErr(err)
	}
	return patientProfileToMap(r, prof), nil
}

func (r *Resolver) UpsertInsurance(p graphql.ResolveParams) (any, error) {
	in, _ := p.Args["input"].(map[string]any)
	ins := r.store.UpsertInsurance(models.InsuranceInfo{
		PatientID:     str(in, "patientId"),
		InsurerName:   str(in, "insurerName"),
		Symbol:        str(in, "symbol"),
		Number:        str(in, "number"),
		CopayCategory: str(in, "copayCategory"),
		ValidUntil:    str(in, "validUntil"),
	})
	return insuranceToMap(ins), nil
}

func (r *Resolver) UpdateAppointment(p graphql.ResolveParams) (any, error) {
	in, _ := p.Args["input"].(map[string]any)
	a, err := r.store.UpdateAppointment(
		str(in, "id"), toInt(in["chair"]), str(in, "startAt"), str(in, "endAt"),
		str(in, "type"), str(in, "staff"), str(in, "notes"), str(in, "status"),
	)
	if err != nil {
		return nil, gqlErr(err)
	}
	return appointmentToMapFull(a), nil
}

func (r *Resolver) CancelAppointment(p graphql.ResolveParams) (any, error) {
	id, _ := p.Args["id"].(string)
	reason, _ := p.Args["reason"].(string)
	a, err := r.store.CancelAppointment(id, reason)
	if err != nil {
		return nil, gqlErr(err)
	}
	return appointmentToMapFull(a), nil
}

func (r *Resolver) MarkAppointmentNoShow(p graphql.ResolveParams) (any, error) {
	id, _ := p.Args["id"].(string)
	a, err := r.store.MarkNoShow(id)
	if err != nil {
		return nil, gqlErr(err)
	}
	return appointmentToMapFull(a), nil
}

func (r *Resolver) ScheduleReminder(p graphql.ResolveParams) (any, error) {
	in, _ := p.Args["input"].(map[string]any)
	rem, err := r.store.ScheduleReminder(
		str(in, "appointmentId"),
		parseReminderChannel(in["channel"]),
		str(in, "scheduledAt"),
		str(in, "recipient"),
	)
	if err != nil {
		return nil, gqlErr(err)
	}
	return reminderToMap(rem), nil
}
