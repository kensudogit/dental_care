package graph

import (
	"github.com/graphql-go/graphql"
	"github.com/pluszero/dental-care-api/internal/store"
)

func NewSchema(s *store.Store) (graphql.Schema, error) {
	r := &Resolver{store: s}

	patientType := graphql.NewObject(graphql.ObjectConfig{
		Name: "Patient",
		Fields: graphql.Fields{
			"id":        &graphql.Field{Type: graphql.NewNonNull(graphql.ID)},
			"chartNo":   &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"name":      &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"kana":      &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"birthDate": &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"phone":     &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"email":     &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"allergies": &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"notes":     &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"lastVisit": &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"createdAt": &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
		},
	})

	appointmentType := graphql.NewObject(graphql.ObjectConfig{
		Name: "Appointment",
		Fields: graphql.Fields{
			"id":          &graphql.Field{Type: graphql.NewNonNull(graphql.ID)},
			"patientId":   &graphql.Field{Type: graphql.NewNonNull(graphql.ID)},
			"patientName": &graphql.Field{Type: graphql.String},
			"chair":       &graphql.Field{Type: graphql.NewNonNull(graphql.Int)},
			"startAt":     &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"endAt":       &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"type":        &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"status":      &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"staff":       &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"notes":       &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
		},
	})

	treatmentType := graphql.NewObject(graphql.ObjectConfig{
		Name: "TreatmentRecord",
		Fields: graphql.Fields{
			"id":          &graphql.Field{Type: graphql.NewNonNull(graphql.ID)},
			"patientId":   &graphql.Field{Type: graphql.NewNonNull(graphql.ID)},
			"patientName": &graphql.Field{Type: graphql.String},
			"visitDate":   &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"tooth":       &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"procedure":   &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"diagnosis":   &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"fee":         &graphql.Field{Type: graphql.NewNonNull(graphql.Int)},
			"staff":       &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"status":      &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"tags":        &graphql.Field{Type: graphql.NewList(graphql.NewNonNull(graphql.String))},
		},
	})

	dashboardType := graphql.NewObject(graphql.ObjectConfig{
		Name: "DashboardStats",
		Fields: graphql.Fields{
			"patientsTotal":       &graphql.Field{Type: graphql.NewNonNull(graphql.Int)},
			"appointmentsToday":   &graphql.Field{Type: graphql.NewNonNull(graphql.Int)},
			"treatmentsThisMonth": &graphql.Field{Type: graphql.NewNonNull(graphql.Int)},
			"revenueThisMonth":    &graphql.Field{Type: graphql.NewNonNull(graphql.Int)},
			"chairUtilization":    &graphql.Field{Type: graphql.NewNonNull(graphql.Float)},
			"noShowRate":          &graphql.Field{Type: graphql.NewNonNull(graphql.Float)},
		},
	})

	healthType := graphql.NewObject(graphql.ObjectConfig{
		Name: "Health",
		Fields: graphql.Fields{
			"ok":      &graphql.Field{Type: graphql.NewNonNull(graphql.Boolean)},
			"service": &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"version": &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
		},
	})

	createPatientInput := graphql.NewInputObject(graphql.InputObjectConfig{
		Name: "CreatePatientInput",
		Fields: graphql.InputObjectConfigFieldMap{
			"chartNo":   &graphql.InputObjectFieldConfig{Type: graphql.String},
			"name":      &graphql.InputObjectFieldConfig{Type: graphql.NewNonNull(graphql.String)},
			"kana":      &graphql.InputObjectFieldConfig{Type: graphql.String},
			"birthDate": &graphql.InputObjectFieldConfig{Type: graphql.String},
			"phone":     &graphql.InputObjectFieldConfig{Type: graphql.String},
			"email":     &graphql.InputObjectFieldConfig{Type: graphql.String},
			"allergies": &graphql.InputObjectFieldConfig{Type: graphql.String},
			"notes":     &graphql.InputObjectFieldConfig{Type: graphql.String},
			"lastVisit": &graphql.InputObjectFieldConfig{Type: graphql.String},
		},
	})

	createAppointmentInput := graphql.NewInputObject(graphql.InputObjectConfig{
		Name: "CreateAppointmentInput",
		Fields: graphql.InputObjectConfigFieldMap{
			"patientId": &graphql.InputObjectFieldConfig{Type: graphql.NewNonNull(graphql.ID)},
			"chair":       &graphql.InputObjectFieldConfig{Type: graphql.NewNonNull(graphql.Int)},
			"startAt":     &graphql.InputObjectFieldConfig{Type: graphql.NewNonNull(graphql.String)},
			"endAt":       &graphql.InputObjectFieldConfig{Type: graphql.NewNonNull(graphql.String)},
			"type":        &graphql.InputObjectFieldConfig{Type: graphql.NewNonNull(graphql.String)},
			"status":      &graphql.InputObjectFieldConfig{Type: graphql.String},
			"staff":       &graphql.InputObjectFieldConfig{Type: graphql.NewNonNull(graphql.String)},
			"notes":       &graphql.InputObjectFieldConfig{Type: graphql.String},
		},
	})

	queryType := graphql.NewObject(graphql.ObjectConfig{
		Name: "Query",
		Fields: graphql.Fields{
			"health": &graphql.Field{
				Type: healthType,
				Resolve: r.Health,
			},
			"dashboard": &graphql.Field{
				Type: dashboardType,
				Resolve: r.Dashboard,
			},
			"patients": &graphql.Field{
				Type: graphql.NewList(graphql.NewNonNull(patientType)),
				Resolve: r.Patients,
			},
			"patient": &graphql.Field{
				Type: patientType,
				Args: graphql.FieldConfigArgument{
					"id": &graphql.ArgumentConfig{Type: graphql.NewNonNull(graphql.ID)},
				},
				Resolve: r.Patient,
			},
			"appointments": &graphql.Field{
				Type: graphql.NewList(graphql.NewNonNull(appointmentType)),
				Args: graphql.FieldConfigArgument{
					"date": &graphql.ArgumentConfig{Type: graphql.String},
				},
				Resolve: r.Appointments,
			},
			"treatments": &graphql.Field{
				Type: graphql.NewList(graphql.NewNonNull(treatmentType)),
				Args: graphql.FieldConfigArgument{
					"patientId": &graphql.ArgumentConfig{Type: graphql.ID},
				},
				Resolve: r.Treatments,
			},
		},
	})

	mutationType := graphql.NewObject(graphql.ObjectConfig{
		Name: "Mutation",
		Fields: graphql.Fields{
			"createPatient": &graphql.Field{
				Type: patientType,
				Args: graphql.FieldConfigArgument{
					"input": &graphql.ArgumentConfig{Type: graphql.NewNonNull(createPatientInput)},
				},
				Resolve: r.CreatePatient,
			},
			"createAppointment": &graphql.Field{
				Type: appointmentType,
				Args: graphql.FieldConfigArgument{
					"input": &graphql.ArgumentConfig{Type: graphql.NewNonNull(createAppointmentInput)},
				},
				Resolve: r.CreateAppointment,
			},
		},
	})

	return graphql.NewSchema(graphql.SchemaConfig{
		Query:    queryType,
		Mutation: mutationType,
	})
}
