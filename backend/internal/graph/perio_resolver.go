package graph

import (
	"github.com/graphql-go/graphql"
	"github.com/pluszero/dental-care-api/internal/models"
)

func (r *Resolver) PerioExams(p graphql.ResolveParams) (any, error) {
	patientID, _ := p.Args["patientId"].(string)
	out := make([]map[string]any, 0)
	for _, e := range r.store.ListPerioExams(patientID) {
		out = append(out, perioExamToMap(e))
	}
	return out, nil
}

func (r *Resolver) PerioExam(p graphql.ResolveParams) (any, error) {
	id, _ := p.Args["id"].(string)
	e, ok := r.store.GetPerioExam(id)
	if !ok {
		return nil, nil
	}
	return perioExamToMap(e), nil
}

func (r *Resolver) CreatePerioExam(p graphql.ResolveParams) (any, error) {
	in, _ := p.Args["input"].(map[string]any)
	e, err := r.store.CreatePerioExam(parsePerioExamInput(in))
	if err != nil {
		return nil, gqlErr(err)
	}
	return perioExamToMap(e), nil
}

func (r *Resolver) UpdatePerioExam(p graphql.ResolveParams) (any, error) {
	in, _ := p.Args["input"].(map[string]any)
	id := str(in, "id")
	patch := parsePerioExamInput(in)
	patch.ID = id
	e, err := r.store.UpdatePerioExam(id, patch)
	if err != nil {
		return nil, gqlErr(err)
	}
	return perioExamToMap(e), nil
}

func (r *Resolver) DeletePerioExam(p graphql.ResolveParams) (any, error) {
	id, _ := p.Args["id"].(string)
	e, err := r.store.DeletePerioExam(id)
	if err != nil {
		return nil, gqlErr(err)
	}
	return perioExamToMap(e), nil
}

func parsePerioExamInput(in map[string]any) models.PerioExam {
	return models.PerioExam{
		PatientID: str(in, "patientId"),
		ExamDate:  str(in, "examDate"),
		Staff:     str(in, "staff"),
		Notes:     str(in, "notes"),
		Sites:     parsePerioSites(in["sites"]),
	}
}
