package graph

import (
	"time"

	"github.com/graphql-go/graphql"
	"github.com/pluszero/dental-care-api/internal/models"
	"github.com/pluszero/dental-care-api/internal/store"
)

func (r *Resolver) XrayImages(p graphql.ResolveParams) (any, error) {
	pid, _ := p.Args["patientId"].(string)
	out := make([]map[string]any, 0)
	for _, x := range r.store.ListXrayImages(pid) {
		out = append(out, xrayToMap(x))
	}
	return out, nil
}

func (r *Resolver) XrayImage(p graphql.ResolveParams) (any, error) {
	id, _ := p.Args["id"].(string)
	x, ok := r.store.GetXrayImage(id)
	if !ok {
		return nil, nil
	}
	return xrayToMap(x), nil
}

func (r *Resolver) CreateXrayImage(p graphql.ResolveParams) (any, error) {
	in, _ := p.Args["input"].(map[string]any)
	x := models.XrayImage{
		PatientID:   str(in, "patientId"),
		Title:       str(in, "title"),
		ImageURL:    str(in, "imageUrl"),
		ImageType:   store.ParseXrayImageType(strVal(in["imageType"])),
		ToothRegion: str(in, "toothRegion"),
		TakenAt:     str(in, "takenAt"),
		Notes:       str(in, "notes"),
	}
	if x.ToothRegion == "" {
		x.ToothRegion = "??"
	}
	if x.TakenAt == "" {
		x.TakenAt = time.Now().Format("2006-01-02")
	}
	created, err := r.store.CreateXrayImage(x)
	if err != nil {
		return nil, gqlErr(err)
	}
	return xrayToMap(created), nil
}

func (r *Resolver) UpdateXrayImage(p graphql.ResolveParams) (any, error) {
	in, _ := p.Args["input"].(map[string]any)
	var imageType models.XrayImageType
	if v, ok := in["imageType"]; ok && v != nil {
		imageType = store.ParseXrayImageType(strVal(v))
	}
	updated, err := r.store.UpdateXrayImage(
		str(in, "id"),
		str(in, "title"),
		str(in, "imageUrl"),
		str(in, "toothRegion"),
		str(in, "takenAt"),
		str(in, "notes"),
		imageType,
	)
	if err != nil {
		return nil, gqlErr(err)
	}
	return xrayToMap(updated), nil
}

func (r *Resolver) DeleteXrayImage(p graphql.ResolveParams) (any, error) {
	id, _ := p.Args["id"].(string)
	deleted, err := r.store.DeleteXrayImage(id)
	if err != nil {
		return nil, gqlErr(err)
	}
	return xrayToMap(deleted), nil
}

func strVal(v any) string {
	if s, ok := v.(string); ok {
		return s
	}
	return ""
}
