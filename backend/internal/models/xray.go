package models

import "time"

type XrayImageType string

const (
	XrayPanoramic      XrayImageType = "PANORAMIC"
	XrayPeriapical     XrayImageType = "PERIAPICAL"
	XrayBitewing       XrayImageType = "BITEWING"
	XrayCephalometric  XrayImageType = "CEPHALOMETRIC"
	XrayIntraoral      XrayImageType = "INTRAORAL"
)

type XrayImage struct {
	ID          string        `json:"id"`
	PatientID   string        `json:"patientId"`
	Title       string        `json:"title"`
	ImageURL    string        `json:"imageUrl"`
	ImageType   XrayImageType `json:"imageType"`
	ToothRegion string        `json:"toothRegion"`
	TakenAt     string        `json:"takenAt"`
	Notes       string        `json:"notes"`
	CreatedAt   time.Time     `json:"createdAt"`
	UpdatedAt   time.Time     `json:"updatedAt"`
}
