package graph

import (
	"github.com/graphql-go/graphql"
	"github.com/pluszero/dental-care-api/internal/models"
)

func perioTypes() (
	perioSiteType, perioExamType *graphql.Object,
	perioSiteInput, createPerioInput, updatePerioInput *graphql.InputObject,
) {
	perioSiteType = graphql.NewObject(graphql.ObjectConfig{
		Name: "PerioSite",
		Fields: graphql.Fields{
			"tooth":    &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"pdMesial": &graphql.Field{Type: graphql.NewNonNull(graphql.Int)},
			"pdBuccal": &graphql.Field{Type: graphql.NewNonNull(graphql.Int)},
			"pdDistal": &graphql.Field{Type: graphql.NewNonNull(graphql.Int)},
			"pdLingual": &graphql.Field{Type: graphql.NewNonNull(graphql.Int)},
			"bop":      &graphql.Field{Type: graphql.NewNonNull(graphql.Boolean)},
			"mobility": &graphql.Field{Type: graphql.NewNonNull(graphql.Int)},
		},
	})

	perioExamType = graphql.NewObject(graphql.ObjectConfig{
		Name: "PerioExam",
		Fields: graphql.Fields{
			"id":        &graphql.Field{Type: graphql.NewNonNull(graphql.ID)},
			"patientId": &graphql.Field{Type: graphql.NewNonNull(graphql.ID)},
			"examDate":  &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"staff":     &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"notes":     &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"sites":     &graphql.Field{Type: graphql.NewList(graphql.NewNonNull(perioSiteType))},
			"createdAt": &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
		},
	})

	perioSiteInput = graphql.NewInputObject(graphql.InputObjectConfig{
		Name: "PerioSiteInput",
		Fields: graphql.InputObjectConfigFieldMap{
			"tooth":    &graphql.InputObjectFieldConfig{Type: graphql.NewNonNull(graphql.String)},
			"pdMesial": &graphql.InputObjectFieldConfig{Type: graphql.Int},
			"pdBuccal": &graphql.InputObjectFieldConfig{Type: graphql.Int},
			"pdDistal": &graphql.InputObjectFieldConfig{Type: graphql.Int},
			"pdLingual": &graphql.InputObjectFieldConfig{Type: graphql.Int},
			"bop":      &graphql.InputObjectFieldConfig{Type: graphql.Boolean},
			"mobility": &graphql.InputObjectFieldConfig{Type: graphql.Int},
		},
	})

	createPerioInput = graphql.NewInputObject(graphql.InputObjectConfig{
		Name: "CreatePerioExamInput",
		Fields: graphql.InputObjectConfigFieldMap{
			"patientId": &graphql.InputObjectFieldConfig{Type: graphql.NewNonNull(graphql.ID)},
			"examDate":  &graphql.InputObjectFieldConfig{Type: graphql.NewNonNull(graphql.String)},
			"staff":     &graphql.InputObjectFieldConfig{Type: graphql.NewNonNull(graphql.String)},
			"notes":     &graphql.InputObjectFieldConfig{Type: graphql.String},
			"sites":     &graphql.InputObjectFieldConfig{Type: graphql.NewList(graphql.NewNonNull(perioSiteInput))},
		},
	})

	updatePerioInput = graphql.NewInputObject(graphql.InputObjectConfig{
		Name: "UpdatePerioExamInput",
		Fields: graphql.InputObjectConfigFieldMap{
			"id":       &graphql.InputObjectFieldConfig{Type: graphql.NewNonNull(graphql.ID)},
			"examDate": &graphql.InputObjectFieldConfig{Type: graphql.String},
			"staff":    &graphql.InputObjectFieldConfig{Type: graphql.String},
			"notes":    &graphql.InputObjectFieldConfig{Type: graphql.String},
			"sites":    &graphql.InputObjectFieldConfig{Type: graphql.NewList(graphql.NewNonNull(perioSiteInput))},
		},
	})

	return
}

func perioQueryFields(r *Resolver, perioExamType *graphql.Object) graphql.Fields {
	return graphql.Fields{
		"perioExams": &graphql.Field{
			Type: graphql.NewList(graphql.NewNonNull(perioExamType)),
			Args: graphql.FieldConfigArgument{
				"patientId": &graphql.ArgumentConfig{Type: graphql.NewNonNull(graphql.ID)},
			},
			Resolve: r.PerioExams,
		},
		"perioExam": &graphql.Field{
			Type: perioExamType,
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{Type: graphql.NewNonNull(graphql.ID)},
			},
			Resolve: r.PerioExam,
		},
	}
}

func perioMutationFields(
	r *Resolver,
	perioExamType *graphql.Object,
	createPerioInput, updatePerioInput *graphql.InputObject,
) graphql.Fields {
	return graphql.Fields{
		"createPerioExam": &graphql.Field{
			Type: perioExamType,
			Args: graphql.FieldConfigArgument{
				"input": &graphql.ArgumentConfig{Type: graphql.NewNonNull(createPerioInput)},
			},
			Resolve: r.CreatePerioExam,
		},
		"updatePerioExam": &graphql.Field{
			Type: perioExamType,
			Args: graphql.FieldConfigArgument{
				"input": &graphql.ArgumentConfig{Type: graphql.NewNonNull(updatePerioInput)},
			},
			Resolve: r.UpdatePerioExam,
		},
		"deletePerioExam": &graphql.Field{
			Type: perioExamType,
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{Type: graphql.NewNonNull(graphql.ID)},
			},
			Resolve: r.DeletePerioExam,
		},
	}
}

func perioExamToMap(e models.PerioExam) map[string]any {
	sites := make([]map[string]any, 0, len(e.Sites))
	for _, s := range e.Sites {
		sites = append(sites, map[string]any{
			"tooth": s.Tooth, "pdMesial": s.PDMesial, "pdBuccal": s.PDBuccal,
			"pdDistal": s.PDDistal, "pdLingual": s.PDLingual,
			"bop": s.BOP, "mobility": s.Mobility,
		})
	}
	return map[string]any{
		"id": e.ID, "patientId": e.PatientID, "examDate": e.ExamDate,
		"staff": e.Staff, "notes": e.Notes, "sites": sites,
		"createdAt": e.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
	}
}

func parsePerioSites(v any) []models.PerioSite {
	out := make([]models.PerioSite, 0)
	arr, ok := v.([]any)
	if !ok {
		return out
	}
	for _, item := range arr {
		m, ok := item.(map[string]any)
		if !ok {
			continue
		}
		out = append(out, models.PerioSite{
			Tooth:     str(m, "tooth"),
			PDMesial:  toInt(m["pdMesial"]),
			PDBuccal:  toInt(m["pdBuccal"]),
			PDDistal:  toInt(m["pdDistal"]),
			PDLingual: toInt(m["pdLingual"]),
			BOP:       toBool(m["bop"]),
			Mobility:  toInt(m["mobility"]),
		})
	}
	return out
}

func toBool(v any) bool {
	if b, ok := v.(bool); ok {
		return b
	}
	return false
}
