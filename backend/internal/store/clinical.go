package store

import (
	"fmt"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/pluszero/dental-care-api/internal/models"
)

func (s *Store) seedClinical() {
	now := time.Now()
	today := now.Format("2006-01-02")

	profiles := map[string]models.PatientProfile{
		"p1": {Patient: s.patients["p1"], Gender: "male", Address: "??????1-2-3"},
		"p2": {Patient: s.patients["p2"], Gender: "female", Address: "???????4-5-6"},
		"p3": {Patient: s.patients["p3"], Gender: "male", Address: "???????7-8-9"},
		"p4": {Patient: s.patients["p4"], Gender: "female", Address: "??????2-3-4"},
	}
	s.patientProfiles = profiles

	s.insurance = map[string]models.InsuranceInfo{
		"p1": {PatientID: "p1", InsurerName: "?????", Symbol: "1234", Number: "567890", CopayCategory: "??", ValidUntil: "2027-03-31"},
		"p2": {PatientID: "p2", InsurerName: "??????", Symbol: "5678", Number: "123456", CopayCategory: "??", ValidUntil: "2027-03-31"},
		"p3": {PatientID: "p3", InsurerName: "????", Symbol: "9012", Number: "345678", CopayCategory: "??", ValidUntil: "2026-12-31"},
		"p4": {PatientID: "p4", InsurerName: "?????", Symbol: "3456", Number: "789012", CopayCategory: "??", ValidUntil: "2027-03-31"},
	}

	s.medicalHistories = []models.MedicalHistory{
		{ID: "mh1", PatientID: "p1", Condition: "???", DiagnosedAt: "2020-05-01", Notes: "???", Resolved: false},
		{ID: "mh2", PatientID: "p1", Condition: "?????", DiagnosedAt: "2018-03-10", Notes: "????", Resolved: true},
		{ID: "mh3", PatientID: "p3", Condition: "???", DiagnosedAt: "2019-11-20", Notes: "HbA1c ??", Resolved: false},
		{ID: "mh4", PatientID: "p2", Condition: "????", DiagnosedAt: "2015-01-01", Notes: "", Resolved: false},
	}

	s.allergyRecords = []models.AllergyRecord{
		{ID: "al1", PatientID: "p1", Substance: "?????", Severity: "high", Reaction: "???"},
		{ID: "al2", PatientID: "p3", Substance: "?????", Severity: "medium", Reaction: "??????"},
	}

	s.familyMembers = []models.FamilyMember{
		{ID: "fm1", PatientID: "p1", Name: "?? ??", Relationship: "???", Phone: "090-9999-8888", LinkedPatientID: ""},
		{ID: "fm2", PatientID: "p1", Name: "?? ?", Relationship: "?", Phone: "080-7777-6666", LinkedPatientID: ""},
		{ID: "fm3", PatientID: "p4", Name: "?? ??", Relationship: "?", Phone: "090-5555-4444", LinkedPatientID: "p3"},
	}

	s.questionnaires = []models.Questionnaire{
		{ID: "q1", PatientID: "p1", SubmittedAt: "2026-05-01T10:00:00", ChiefComplaint: "????", CurrentMedications: "???", Smoking: false, Pregnancy: false, DentalAnxiety: 2, Notes: ""},
		{ID: "q2", PatientID: "p2", SubmittedAt: "2026-05-10T14:30:00", ChiefComplaint: "????", CurrentMedications: "", Smoking: false, Pregnancy: false, DentalAnxiety: 4, Notes: "??????????"},
	}

	s.emergencyContacts = []models.EmergencyContact{
		{ID: "ec1", PatientID: "p1", Name: "?? ??", Relationship: "???", Phone: "090-9999-8888", Priority: 1},
		{ID: "ec2", PatientID: "p1", Name: "?? ??", Relationship: "?", Phone: "080-1111-2222", Priority: 2},
		{ID: "ec3", PatientID: "p4", Name: "?? ??", Relationship: "?", Phone: "090-5555-4444", Priority: 1},
	}

	s.visitRecords = []models.VisitRecord{
		{ID: "v1", PatientID: "p1", VisitDate: "2026-05-10", VisitType: "treatment", Summary: "??????", Staff: "??? ?", Status: "completed"},
		{ID: "v2", PatientID: "p1", VisitDate: today, VisitType: "appointment", Summary: "????", Staff: "Dr. ??", Status: "confirmed"},
		{ID: "v3", PatientID: "p2", VisitDate: "2026-05-15", VisitType: "treatment", Summary: "????", Staff: "Dr. ??", Status: "completed"},
		{ID: "v4", PatientID: "p3", VisitDate: "2026-04-20", VisitType: "appointment", Summary: "???????", Staff: "Dr. ??", Status: "no_show"},
	}

	s.chairs = []models.Chair{
		{ID: "c1", Number: 1, Name: "???1", Status: "available"},
		{ID: "c2", Number: 2, Name: "???2", Status: "available"},
		{ID: "c3", Number: 3, Name: "???3", Status: "available"},
	}

	s.staffSchedules = []models.StaffSchedule{
		{ID: "ss1", StaffID: "st1", StaffName: "Dr. ??", Role: "dentist", Date: today, StartTime: "09:00", EndTime: "18:00", Notes: ""},
		{ID: "ss2", StaffID: "st2", StaffName: "??? ?", Role: "hygienist", Date: today, StartTime: "09:00", EndTime: "17:00", Notes: "PMTC??"},
		{ID: "ss3", StaffID: "st2", StaffName: "??? ?", Role: "hygienist", Date: today, StartTime: "13:00", EndTime: "17:00", Notes: "??"},
	}

	// enrich appointments
	if a, ok := s.appointments["a1"]; ok {
		a.StaffRole = "dentist"
		s.appointments["a1"] = a
	}
	if a, ok := s.appointments["a2"]; ok {
		a.StaffRole = "dentist"
		s.appointments["a2"] = a
	}
	if a, ok := s.appointments["a3"]; ok {
		a.StaffRole = "hygienist"
		s.appointments["a3"] = a
	}
	if a, ok := s.appointments["a4"]; ok {
		a.StaffRole = "dentist"
		s.appointments["a4"] = a
	}

	s.appointments["a5"] = models.Appointment{
		ID: "a5", PatientID: "p3", Patient: "?? ??", Chair: 2,
		StartAt: today + "T09:00:00", EndAt: today + "T09:30:00",
		Type: "????", Status: "no_show", Staff: "Dr. ??", StaffRole: "dentist",
		NoShow: true, Notes: "???????",
	}

	s.reminders = []models.ReminderNotification{
		{ID: "r1", AppointmentID: "a1", Channel: models.ReminderEmail, ScheduledAt: today + "T08:00:00", Status: "sent", SentAt: today + "T08:00:05", Recipient: "taro@example.com"},
		{ID: "r2", AppointmentID: "a1", Channel: models.ReminderLINE, ScheduledAt: today + "T08:30:00", Status: "sent", SentAt: today + "T08:30:02", Recipient: "090-1234-5678"},
		{ID: "r3", AppointmentID: "a2", Channel: models.ReminderSMS, ScheduledAt: today + "T09:00:00", Status: "scheduled", Recipient: "080-9876-5432"},
		{ID: "r4", AppointmentID: "a4", Channel: models.ReminderEmail, ScheduledAt: today + "T12:00:00", Status: "scheduled", Recipient: ""},
	}
	_ = now
}

func (s *Store) GetPatientProfile(id string) (models.PatientProfile, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	if p, ok := s.patientProfiles[id]; ok {
		return p, true
	}
	if base, ok := s.patients[id]; ok {
		return models.PatientProfile{Patient: base}, true
	}
	return models.PatientProfile{}, false
}

func (s *Store) GetInsurance(patientID string) (models.InsuranceInfo, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	ins, ok := s.insurance[patientID]
	return ins, ok
}

func filterByPatientID[T any](items []T, patientID string, getPID func(T) string) []T {
	out := make([]T, 0)
	for _, item := range items {
		if getPID(item) == patientID {
			out = append(out, item)
		}
	}
	return out
}

func (s *Store) ListMedicalHistories(patientID string) []models.MedicalHistory {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return filterByPatientID(s.medicalHistories, patientID, func(m models.MedicalHistory) string { return m.PatientID })
}

func (s *Store) ListAllergyRecords(patientID string) []models.AllergyRecord {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return filterByPatientID(s.allergyRecords, patientID, func(a models.AllergyRecord) string { return a.PatientID })
}

func (s *Store) ListFamilyMembers(patientID string) []models.FamilyMember {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return filterByPatientID(s.familyMembers, patientID, func(f models.FamilyMember) string { return f.PatientID })
}

func (s *Store) ListQuestionnaires(patientID string) []models.Questionnaire {
	s.mu.RLock()
	defer s.mu.RUnlock()
	out := filterByPatientID(s.questionnaires, patientID, func(q models.Questionnaire) string { return q.PatientID })
	sort.Slice(out, func(i, j int) bool { return out[i].SubmittedAt > out[j].SubmittedAt })
	return out
}

func (s *Store) ListEmergencyContacts(patientID string) []models.EmergencyContact {
	s.mu.RLock()
	defer s.mu.RUnlock()
	out := filterByPatientID(s.emergencyContacts, patientID, func(e models.EmergencyContact) string { return e.PatientID })
	sort.Slice(out, func(i, j int) bool { return out[i].Priority < out[j].Priority })
	return out
}

func (s *Store) ListVisitRecords(patientID string) []models.VisitRecord {
	s.mu.RLock()
	defer s.mu.RUnlock()
	out := filterByPatientID(s.visitRecords, patientID, func(v models.VisitRecord) string { return v.PatientID })
	sort.Slice(out, func(i, j int) bool { return out[i].VisitDate > out[j].VisitDate })
	return out
}

func (s *Store) ListChairs() []models.Chair {
	s.mu.RLock()
	defer s.mu.RUnlock()
	out := make([]models.Chair, len(s.chairs))
	copy(out, s.chairs)
	sort.Slice(out, func(i, j int) bool { return out[i].Number < out[j].Number })
	return out
}

func (s *Store) ListStaffSchedules(date string) []models.StaffSchedule {
	s.mu.RLock()
	defer s.mu.RUnlock()
	if date == "" {
		date = time.Now().Format("2006-01-02")
	}
	out := make([]models.StaffSchedule, 0)
	for _, ss := range s.staffSchedules {
		if ss.Date == date {
			out = append(out, ss)
		}
	}
	return out
}

func (s *Store) ListAppointmentsRange(from, to string) []models.Appointment {
	s.mu.RLock()
	defer s.mu.RUnlock()
	out := make([]models.Appointment, 0)
	for _, a := range s.appointments {
		d := apptDate(a.StartAt)
		if d >= from && d <= to {
			out = append(out, a)
		}
	}
	sort.Slice(out, func(i, j int) bool { return out[i].StartAt < out[j].StartAt })
	return out
}

func (s *Store) ListNoShowAppointments() []models.Appointment {
	s.mu.RLock()
	defer s.mu.RUnlock()
	out := make([]models.Appointment, 0)
	for _, a := range s.appointments {
		if a.NoShow || a.Status == "no_show" {
			out = append(out, a)
		}
	}
	return out
}

func (s *Store) ListReminders(appointmentID string) []models.ReminderNotification {
	s.mu.RLock()
	defer s.mu.RUnlock()
	out := make([]models.ReminderNotification, 0)
	for _, r := range s.reminders {
		if r.AppointmentID == appointmentID {
			out = append(out, r)
		}
	}
	return out
}

func apptDate(startAt string) string {
	if len(startAt) >= 10 {
		return startAt[:10]
	}
	return startAt
}

func (s *Store) UpsertInsurance(ins models.InsuranceInfo) models.InsuranceInfo {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.insurance[ins.PatientID] = ins
	return ins
}

func (s *Store) UpdatePatientProfile(id, gender, address, phone, email, notes string) (models.PatientProfile, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	p, ok := s.patients[id]
	if !ok {
		return models.PatientProfile{}, fmt.Errorf("patient not found")
	}
	if phone != "" {
		p.Phone = phone
	}
	if email != "" {
		p.Email = email
	}
	if notes != "" {
		p.Notes = notes
	}
	s.patients[id] = p
	prof := s.patientProfiles[id]
	prof.Patient = p
	if gender != "" {
		prof.Gender = gender
	}
	if address != "" {
		prof.Address = address
	}
	s.patientProfiles[id] = prof
	return prof, nil
}

func (s *Store) UpdateAppointment(id string, chair int, startAt, endAt, apptType, staff, notes, status string) (models.Appointment, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	a, ok := s.appointments[id]
	if !ok {
		return models.Appointment{}, fmt.Errorf("appointment not found")
	}
	if chair > 0 {
		a.Chair = chair
	}
	if startAt != "" {
		a.StartAt = startAt
	}
	if endAt != "" {
		a.EndAt = endAt
	}
	if apptType != "" {
		a.Type = apptType
	}
	if staff != "" {
		a.Staff = staff
	}
	if notes != "" {
		a.Notes = notes
	}
	if status != "" {
		a.Status = status
	}
	s.appointments[id] = a
	return a, nil
}

func (s *Store) CancelAppointment(id, reason string) (models.Appointment, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	a, ok := s.appointments[id]
	if !ok {
		return models.Appointment{}, fmt.Errorf("appointment not found")
	}
	a.Status = "cancelled"
	a.CancelReason = reason
	a.CancelledAt = time.Now().Format(time.RFC3339)
	s.appointments[id] = a
	return a, nil
}

func (s *Store) MarkNoShow(id string) (models.Appointment, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	a, ok := s.appointments[id]
	if !ok {
		return models.Appointment{}, fmt.Errorf("appointment not found")
	}
	a.NoShow = true
	a.Status = "no_show"
	s.appointments[id] = a
	return a, nil
}

func (s *Store) ScheduleReminder(appointmentID string, channel models.ReminderChannel, scheduledAt, recipient string) (models.ReminderNotification, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	if _, ok := s.appointments[appointmentID]; !ok {
		return models.ReminderNotification{}, fmt.Errorf("appointment not found")
	}
	r := models.ReminderNotification{
		ID:            "r" + strconv.FormatInt(time.Now().UnixNano(), 10),
		AppointmentID: appointmentID,
		Channel:       channel,
		ScheduledAt:   scheduledAt,
		Status:        "scheduled",
		Recipient:     recipient,
	}
	s.reminders = append(s.reminders, r)
	return r, nil
}

func (s *Store) SearchPatients(query string) []models.Patient {
	s.mu.RLock()
	defer s.mu.RUnlock()
	q := strings.ToLower(strings.TrimSpace(query))
	out := make([]models.Patient, 0)
	for _, p := range s.patients {
		if q == "" ||
			strings.Contains(strings.ToLower(p.Name), q) ||
			strings.Contains(strings.ToLower(p.Kana), q) ||
			strings.Contains(p.ChartNo, q) ||
			strings.Contains(p.Phone, q) {
			out = append(out, p)
		}
	}
	return out
}

func (s *Store) NoShowRate() float64 {
	s.mu.RLock()
	defer s.mu.RUnlock()
	total := len(s.appointments)
	if total == 0 {
		return 0
	}
	noshow := 0
	for _, a := range s.appointments {
		if a.NoShow || a.Status == "no_show" {
			noshow++
		}
	}
	return float64(noshow) / float64(total)
}
