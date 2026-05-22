package store

import (
	"fmt"
	"sync"
	"time"

	"github.com/pluszero/dental-care-api/internal/models"
)

type Store struct {
	mu           sync.RWMutex
	patients     map[string]models.Patient
	appointments map[string]models.Appointment
	treatments   map[string]models.TreatmentRecord
}

func New() *Store {
	s := &Store{
		patients:     make(map[string]models.Patient),
		appointments: make(map[string]models.Appointment),
		treatments:   make(map[string]models.TreatmentRecord),
	}
	s.seed()
	return s
}

func (s *Store) seed() {
	now := time.Now()
	today := now.Format("2006-01-02")

	patients := []models.Patient{
		{ID: "p1", ChartNo: "10001", Name: "山田 太郎", Kana: "ヤマダ タロウ", BirthDate: "1985-03-12", Phone: "090-1234-5678", Email: "taro@example.com", Allergies: "ペニシリン", Notes: "定期検診希望", LastVisit: "2026-05-10", CreatedAt: now.Add(-365 * 24 * time.Hour)},
		{ID: "p2", ChartNo: "10002", Name: "佐藤 花子", Kana: "サトウ ハナコ", BirthDate: "1992-07-22", Phone: "080-9876-5432", Email: "hanako@example.com", Allergies: "", Notes: "矯正相談済", LastVisit: "2026-05-15", CreatedAt: now.Add(-200 * 24 * time.Hour)},
		{ID: "p3", ChartNo: "10003", Name: "鈴木 一郎", Kana: "スズキ イチロウ", BirthDate: "1978-11-05", Phone: "070-1111-2222", Email: "", Allergies: "ラテックス", Notes: "", LastVisit: "2026-04-28", CreatedAt: now.Add(-90 * 24 * time.Hour)},
		{ID: "p4", ChartNo: "10004", Name: "田中 美咲", Kana: "タナカ ミサキ", BirthDate: "2001-01-18", Phone: "090-3333-4444", Email: "misaki@example.com", Allergies: "", Notes: "学生割引対象", LastVisit: "2026-05-18", CreatedAt: now.Add(-30 * 24 * time.Hour)},
	}
	for _, p := range patients {
		s.patients[p.ID] = p
	}

	appointments := []models.Appointment{
		{ID: "a1", PatientID: "p1", Chair: 1, StartAt: today + "T09:00:00", EndAt: today + "T09:30:00", Type: "定期検診", Status: "confirmed", Staff: "Dr. 木村", Notes: ""},
		{ID: "a2", PatientID: "p2", Chair: 2, StartAt: today + "T10:00:00", EndAt: today + "T11:00:00", Type: "矯正調整", Status: "confirmed", Staff: "Dr. 木村", Notes: "ワイヤー交換"},
		{ID: "a3", PatientID: "p4", Chair: 1, StartAt: today + "T11:30:00", EndAt: today + "T12:00:00", Type: "クリーニング", Status: "pending", Staff: "衛生士 林", Notes: ""},
		{ID: "a4", PatientID: "p3", Chair: 3, StartAt: today + "T14:00:00", EndAt: today + "T15:00:00", Type: "CR充填", Status: "confirmed", Staff: "Dr. 木村", Notes: "#16"},
	}
	for _, a := range appointments {
		if p, ok := s.patients[a.PatientID]; ok {
			a.Patient = p.Name
		}
		s.appointments[a.ID] = a
	}

	treatments := []models.TreatmentRecord{
		{ID: "t1", PatientID: "p1", VisitDate: "2026-05-10", Tooth: "16", Procedure: "スケーリング", Diagnosis: "歯石沈着", Fee: 3300, Staff: "衛生士 林", Status: "completed", Tags: []string{"予防"}},
		{ID: "t2", PatientID: "p2", VisitDate: "2026-05-15", Tooth: "全体", Procedure: "矯正調整", Diagnosis: "叢生", Fee: 8800, Staff: "Dr. 木村", Status: "completed", Tags: []string{"矯正"}},
		{ID: "t3", PatientID: "p3", VisitDate: "2026-04-28", Tooth: "26", Procedure: "根管治療", Diagnosis: "歯髄炎", Fee: 12000, Staff: "Dr. 木村", Status: "in_progress", Tags: []string{"保存"}},
		{ID: "t4", PatientID: "p4", VisitDate: "2026-05-18", Tooth: "全体", Procedure: "PMTC", Diagnosis: "軽度歯周炎", Fee: 5500, Staff: "衛生士 林", Status: "completed", Tags: []string{"予防", "歯周"}},
	}
	for _, t := range treatments {
		if p, ok := s.patients[t.PatientID]; ok {
			t.PatientName = p.Name
		}
		s.treatments[t.ID] = t
	}
}

func (s *Store) ListPatients() []models.Patient {
	s.mu.RLock()
	defer s.mu.RUnlock()
	out := make([]models.Patient, 0, len(s.patients))
	for _, p := range s.patients {
		out = append(out, p)
	}
	return out
}

func (s *Store) GetPatient(id string) (models.Patient, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	p, ok := s.patients[id]
	return p, ok
}

func (s *Store) CreatePatient(p models.Patient) models.Patient {
	s.mu.Lock()
	defer s.mu.Unlock()
	p.CreatedAt = time.Now()
	s.patients[p.ID] = p
	return p
}

func (s *Store) ListAppointments(date string) []models.Appointment {
	s.mu.RLock()
	defer s.mu.RUnlock()
	out := make([]models.Appointment, 0)
	for _, a := range s.appointments {
		if date == "" || len(a.StartAt) >= 10 && a.StartAt[:10] == date {
			out = append(out, a)
		}
	}
	return out
}

func (s *Store) CreateAppointment(a models.Appointment) models.Appointment {
	s.mu.Lock()
	defer s.mu.Unlock()
	if p, ok := s.patients[a.PatientID]; ok {
		a.Patient = p.Name
	}
	s.appointments[a.ID] = a
	return a
}

func (s *Store) ListTreatments(patientID string) []models.TreatmentRecord {
	s.mu.RLock()
	defer s.mu.RUnlock()
	out := make([]models.TreatmentRecord, 0)
	for _, t := range s.treatments {
		if patientID == "" || t.PatientID == patientID {
			out = append(out, t)
		}
	}
	return out
}

func (s *Store) Dashboard() models.DashboardStats {
	s.mu.RLock()
	defer s.mu.RUnlock()
	today := time.Now().Format("2006-01-02")
	apptToday := 0
	revenue := 0
	for _, a := range s.appointments {
		if len(a.StartAt) >= 10 && a.StartAt[:10] == today {
			apptToday++
		}
	}
	for _, t := range s.treatments {
		if len(t.VisitDate) >= 7 && t.VisitDate[:7] == time.Now().Format("2006-01") {
			revenue += t.Fee
		}
	}
	return models.DashboardStats{
		PatientsTotal:       len(s.patients),
		AppointmentsToday:   apptToday,
		TreatmentsThisMonth: len(s.treatments),
		RevenueThisMonth:    revenue,
		ChairUtilization:    0.72,
		NoShowRate:          0.04,
	}
}

func NextID(prefix string, n int) string {
	return fmt.Sprintf("%s%d", prefix, n+1)
}
