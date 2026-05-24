package graph

import (
	"github.com/graphql-go/graphql"
	"github.com/pluszero/dental-care-api/internal/models"
)

func (r *Resolver) Treatment(p graphql.ResolveParams) (any, error) {
	id, _ := p.Args["id"].(string)
	t, ok := r.store.GetTreatment(id)
	if !ok {
		return nil, nil
	}
	return treatmentToMap(t), nil
}

func (r *Resolver) CreateTreatment(p graphql.ResolveParams) (any, error) {
	in, _ := p.Args["input"].(map[string]any)
	status := str(in, "status")
	if status == "" {
		status = "completed"
	}
	tags := stringSlice(in["tags"])
	t := models.TreatmentRecord{
		PatientID:       str(in, "patientId"),
		VisitDate:       str(in, "visitDate"),
		Tooth:           str(in, "tooth"),
		Procedure:       str(in, "procedure"),
		ProcedureCode:   str(in, "procedureCode"),
		Diagnosis:       str(in, "diagnosis"),
		Fee:             toInt(in["fee"]),
		Staff:           str(in, "staff"),
		Status:          status,
		Tags:            tags,
		Subjective:      str(in, "subjective"),
		Objective:       str(in, "objective"),
		Assessment:      str(in, "assessment"),
		Plan:            str(in, "plan"),
		ToothChartJSON:  str(in, "toothChartJson"),
	}
	created, err := r.store.CreateTreatment(t)
	if err != nil {
		return nil, gqlErr(err)
	}
	return treatmentToMap(created), nil
}

func (r *Resolver) UpdateTreatment(p graphql.ResolveParams) (any, error) {
	in, _ := p.Args["input"].(map[string]any)
	id := str(in, "id")
	patch := models.TreatmentRecord{}
	if v, ok := in["visitDate"]; ok && v != nil {
		patch.VisitDate = str(in, "visitDate")
	}
	if v, ok := in["tooth"]; ok && v != nil {
		patch.Tooth = str(in, "tooth")
	}
	if v, ok := in["procedure"]; ok && v != nil {
		patch.Procedure = str(in, "procedure")
	}
	if v, ok := in["diagnosis"]; ok && v != nil {
		patch.Diagnosis = str(in, "diagnosis")
	}
	if v, ok := in["fee"]; ok && v != nil {
		patch.Fee = toInt(v)
	}
	if v, ok := in["staff"]; ok && v != nil {
		patch.Staff = str(in, "staff")
	}
	if v, ok := in["status"]; ok && v != nil {
		patch.Status = str(in, "status")
	}
	if v, ok := in["tags"]; ok && v != nil {
		patch.Tags = stringSlice(v)
	}
	clinical := false
	if _, ok := in["subjective"]; ok {
		clinical = true
		patch.Subjective = str(in, "subjective")
	}
	if _, ok := in["objective"]; ok {
		clinical = true
		patch.Objective = str(in, "objective")
	}
	if _, ok := in["assessment"]; ok {
		clinical = true
		patch.Assessment = str(in, "assessment")
	}
	if _, ok := in["plan"]; ok {
		clinical = true
		patch.Plan = str(in, "plan")
	}
	if _, ok := in["toothChartJson"]; ok {
		clinical = true
		patch.ToothChartJSON = str(in, "toothChartJson")
	}
	if _, ok := in["procedureCode"]; ok {
		patch.ProcedureCode = str(in, "procedureCode")
	}
	updated, err := r.store.UpdateTreatment(id, patch, clinical)
	if err != nil {
		return nil, gqlErr(err)
	}
	return treatmentToMap(updated), nil
}

func (r *Resolver) DeleteTreatment(p graphql.ResolveParams) (any, error) {
	id, _ := p.Args["id"].(string)
	deleted, err := r.store.DeleteTreatment(id)
	if err != nil {
		return nil, gqlErr(err)
	}
	return treatmentToMap(deleted), nil
}

func stringSlice(v any) []string {
	switch arr := v.(type) {
	case []any:
		out := make([]string, 0, len(arr))
		for _, item := range arr {
			if s, ok := item.(string); ok && s != "" {
				out = append(out, s)
			}
		}
		return out
	case []string:
		return arr
	default:
		return []string{}
	}
}
