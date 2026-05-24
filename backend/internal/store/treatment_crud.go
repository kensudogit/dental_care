package store

import (
	"errors"
	"fmt"
	"strconv"
	"time"

	"github.com/pluszero/dental-care-api/internal/models"
)

var ErrTreatmentNotFound = errors.New("treatment not found")

func (s *Store) GetTreatment(id string) (models.TreatmentRecord, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	t, ok := s.treatments[id]
	return t, ok
}

func (s *Store) CreateTreatment(t models.TreatmentRecord) (models.TreatmentRecord, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	if t.ID == "" {
		t.ID = "t" + strconv.FormatInt(time.Now().UnixNano(), 10)
	}
	if p, ok := s.patients[t.PatientID]; ok {
		t.PatientName = p.Name
	}
	if t.Status == "" {
		t.Status = "completed"
	}
	if t.Tags == nil {
		t.Tags = []string{}
	}
	s.treatments[t.ID] = t
	return t, nil
}

func (s *Store) UpdateTreatment(id string, patch models.TreatmentRecord) (models.TreatmentRecord, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	cur, ok := s.treatments[id]
	if !ok {
		return models.TreatmentRecord{}, ErrTreatmentNotFound
	}
	if patch.VisitDate != "" {
		cur.VisitDate = patch.VisitDate
	}
	if patch.Tooth != "" {
		cur.Tooth = patch.Tooth
	}
	if patch.Procedure != "" {
		cur.Procedure = patch.Procedure
	}
	if patch.Diagnosis != "" {
		cur.Diagnosis = patch.Diagnosis
	}
	if patch.Fee > 0 {
		cur.Fee = patch.Fee
	}
	if patch.Staff != "" {
		cur.Staff = patch.Staff
	}
	if patch.Status != "" {
		cur.Status = patch.Status
	}
	if patch.Tags != nil {
		cur.Tags = patch.Tags
	}
	s.treatments[id] = cur
	return cur, nil
}

func (s *Store) DeleteTreatment(id string) (models.TreatmentRecord, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	t, ok := s.treatments[id]
	if !ok {
		return models.TreatmentRecord{}, fmt.Errorf("%w: %s", ErrTreatmentNotFound, id)
	}
	delete(s.treatments, id)
	return t, nil
}
