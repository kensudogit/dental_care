package store

import (
	"errors"
	"fmt"
	"sort"
	"strconv"
	"time"

	"github.com/pluszero/dental-care-api/internal/models"
)

var ErrPerioExamNotFound = errors.New("perio exam not found")

func (s *Store) seedPerio() {
	now := time.Now()
	exams := []models.PerioExam{
		{
			ID: "pe1", PatientID: "p1", ExamDate: "2026-05-10", Staff: "\u885b\u751f\u58eb \u6797",
			Notes: "\u521d\u56de\u6b6f\u5468\u691c\u67fb",
			Sites: []models.PerioSite{
				{Tooth: "16", PDMesial: 2, PDBuccal: 3, PDDistal: 2, PDLingual: 2, BOP: true, Mobility: 0},
				{Tooth: "26", PDMesial: 3, PDBuccal: 3, PDDistal: 3, PDLingual: 2, BOP: true, Mobility: 0},
			},
			CreatedAt: now,
		},
		{
			ID: "pe2", PatientID: "p4", ExamDate: "2026-05-18", Staff: "\u885b\u751f\u58eb \u6797",
			Notes: "PMTC\u524d\u691c\u67fb",
			Sites: []models.PerioSite{
				{Tooth: "36", PDMesial: 4, PDBuccal: 4, PDDistal: 3, PDLingual: 3, BOP: true, Mobility: 0},
				{Tooth: "46", PDMesial: 3, PDBuccal: 4, PDDistal: 3, PDLingual: 3, BOP: false, Mobility: 0},
			},
			CreatedAt: now,
		},
	}
	for _, e := range exams {
		s.perioExams[e.ID] = e
	}
}

func (s *Store) ListPerioExams(patientID string) []models.PerioExam {
	s.mu.RLock()
	defer s.mu.RUnlock()
	out := make([]models.PerioExam, 0)
	for _, e := range s.perioExams {
		if e.PatientID == patientID {
			out = append(out, e)
		}
	}
	sort.Slice(out, func(i, j int) bool { return out[i].ExamDate > out[j].ExamDate })
	return out
}

func (s *Store) GetPerioExam(id string) (models.PerioExam, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	e, ok := s.perioExams[id]
	return e, ok
}

func (s *Store) CreatePerioExam(e models.PerioExam) (models.PerioExam, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	if e.ID == "" {
		e.ID = "pe" + strconv.FormatInt(time.Now().UnixNano(), 10)
	}
	if e.CreatedAt.IsZero() {
		e.CreatedAt = time.Now()
	}
	if e.Sites == nil {
		e.Sites = []models.PerioSite{}
	}
	s.perioExams[e.ID] = e
	return e, nil
}

func (s *Store) UpdatePerioExam(id string, patch models.PerioExam) (models.PerioExam, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	cur, ok := s.perioExams[id]
	if !ok {
		return models.PerioExam{}, ErrPerioExamNotFound
	}
	if patch.ExamDate != "" {
		cur.ExamDate = patch.ExamDate
	}
	if patch.Staff != "" {
		cur.Staff = patch.Staff
	}
	cur.Notes = patch.Notes
	if patch.Sites != nil {
		cur.Sites = patch.Sites
	}
	s.perioExams[id] = cur
	return cur, nil
}

func (s *Store) DeletePerioExam(id string) (models.PerioExam, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	e, ok := s.perioExams[id]
	if !ok {
		return models.PerioExam{}, fmt.Errorf("%w: %s", ErrPerioExamNotFound, id)
	}
	delete(s.perioExams, id)
	return e, nil
}
