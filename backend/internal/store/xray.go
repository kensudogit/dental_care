package store

import (
	"fmt"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/pluszero/dental-care-api/internal/models"
)

func (s *Store) seedXrays() {
	now := time.Now()
	s.xrayImages = map[string]models.XrayImage{
		"x1": {
			ID: "x1", PatientID: "p1", Title: "????????",
			ImageURL: "/uploads/xrays/placeholder.svg", ImageType: models.XrayPanoramic,
			ToothRegion: "??", TakenAt: "2026-05-10", Notes: "18?28 ????",
			CreatedAt: now.Add(-30 * 24 * time.Hour), UpdatedAt: now.Add(-30 * 24 * time.Hour),
		},
		"x2": {
			ID: "x2", PatientID: "p1", Title: "?????#16?",
			ImageURL: "/uploads/xrays/placeholder.svg", ImageType: models.XrayPeriapical,
			ToothRegion: "16", TakenAt: "2026-05-10", Notes: "C2 ???",
			CreatedAt: now.Add(-25 * 24 * time.Hour), UpdatedAt: now.Add(-25 * 24 * time.Hour),
		},
		"x3": {
			ID: "x3", PatientID: "p3", Title: "????",
			ImageURL: "/uploads/xrays/placeholder.svg", ImageType: models.XrayPanoramic,
			ToothRegion: "??", TakenAt: "2026-04-28", Notes: "?????",
			CreatedAt: now.Add(-60 * 24 * time.Hour), UpdatedAt: now.Add(-60 * 24 * time.Hour),
		},
	}
}

func (s *Store) ListXrayImages(patientID string) []models.XrayImage {
	s.mu.RLock()
	defer s.mu.RUnlock()
	out := make([]models.XrayImage, 0)
	for _, x := range s.xrayImages {
		if patientID == "" || x.PatientID == patientID {
			out = append(out, x)
		}
	}
	sort.Slice(out, func(i, j int) bool {
		return out[i].TakenAt > out[j].TakenAt
	})
	return out
}

func (s *Store) GetXrayImage(id string) (models.XrayImage, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	x, ok := s.xrayImages[id]
	return x, ok
}

func (s *Store) CreateXrayImage(x models.XrayImage) (models.XrayImage, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	if _, ok := s.patients[x.PatientID]; !ok {
		return models.XrayImage{}, fmt.Errorf("patient not found")
	}
	now := time.Now()
	if x.ID == "" {
		x.ID = "x" + strconv.FormatInt(now.UnixNano(), 10)
	}
	x.CreatedAt = now
	x.UpdatedAt = now
	if x.ImageType == "" {
		x.ImageType = models.XrayPanoramic
	}
	s.xrayImages[x.ID] = x
	return x, nil
}

func (s *Store) UpdateXrayImage(id, title, imageURL, toothRegion, takenAt, notes string, imageType models.XrayImageType) (models.XrayImage, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	x, ok := s.xrayImages[id]
	if !ok {
		return models.XrayImage{}, fmt.Errorf("xray not found")
	}
	if title != "" {
		x.Title = title
	}
	if imageURL != "" {
		x.ImageURL = imageURL
	}
	if toothRegion != "" {
		x.ToothRegion = toothRegion
	}
	if takenAt != "" {
		x.TakenAt = takenAt
	}
	if notes != "" {
		x.Notes = notes
	}
	if imageType != "" {
		x.ImageType = imageType
	}
	x.UpdatedAt = time.Now()
	s.xrayImages[id] = x
	return x, nil
}

func (s *Store) DeleteXrayImage(id string) (models.XrayImage, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	x, ok := s.xrayImages[id]
	if !ok {
		return models.XrayImage{}, fmt.Errorf("xray not found")
	}
	delete(s.xrayImages, id)
	return x, nil
}

func ParseXrayImageType(v string) models.XrayImageType {
	switch strings.ToUpper(strings.TrimSpace(v)) {
	case "PERIAPICAL":
		return models.XrayPeriapical
	case "BITEWING":
		return models.XrayBitewing
	case "CEPHALOMETRIC":
		return models.XrayCephalometric
	case "INTRAORAL":
		return models.XrayIntraoral
	default:
		return models.XrayPanoramic
	}
}
