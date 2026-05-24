package graph

import (
	"github.com/graphql-go/graphql"
	"github.com/pluszero/dental-care-api/internal/store"
)

func NewSchema(s *store.Store) (graphql.Schema, error) {
	r := &Resolver{store: s}

	_, planTierEnum, _, _, orgType, teamMemberType, _, subPlanType,
		usageType, apiKeyType, apiKeyCreatedType, auditType, sessionType,
		updateOrgInput, inviteInput, updateRoleInput, createKeyInput := saasTypes()

	clinicalProfileType, clinicalInsuranceType, _, _, _, _, _, _,
		clinicalChairType, clinicalStaffScheduleType, clinicalReminderType, _,
		updateProfileInput, upsertInsuranceInput, updateApptInput, scheduleReminderInput,
		appointmentType := clinicalTypes(r)

	xrayImageType, _, createXrayInput, updateXrayInput := xrayTypes()

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

	pageInfo := pageInfoType()
	patientPageType := pageListType("PatientPage", patientType, pageInfo)
	appointmentPageType := pageListType("AppointmentPage", appointmentType, pageInfo)
	treatmentPageType := pageListType("TreatmentPage", treatmentType, pageInfo)
	auditLogPageType := pageListType("AuditLogPage", auditType, pageInfo)

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

	createTreatmentInput := graphql.NewInputObject(graphql.InputObjectConfig{
		Name: "CreateTreatmentInput",
		Fields: graphql.InputObjectConfigFieldMap{
			"patientId": &graphql.InputObjectFieldConfig{Type: graphql.NewNonNull(graphql.ID)},
			"visitDate": &graphql.InputObjectFieldConfig{Type: graphql.NewNonNull(graphql.String)},
			"tooth":     &graphql.InputObjectFieldConfig{Type: graphql.NewNonNull(graphql.String)},
			"procedure": &graphql.InputObjectFieldConfig{Type: graphql.NewNonNull(graphql.String)},
			"diagnosis": &graphql.InputObjectFieldConfig{Type: graphql.NewNonNull(graphql.String)},
			"fee":       &graphql.InputObjectFieldConfig{Type: graphql.NewNonNull(graphql.Int)},
			"staff":     &graphql.InputObjectFieldConfig{Type: graphql.NewNonNull(graphql.String)},
			"status":    &graphql.InputObjectFieldConfig{Type: graphql.String},
			"tags":      &graphql.InputObjectFieldConfig{Type: graphql.NewList(graphql.NewNonNull(graphql.String))},
		},
	})

	updateTreatmentInput := graphql.NewInputObject(graphql.InputObjectConfig{
		Name: "UpdateTreatmentInput",
		Fields: graphql.InputObjectConfigFieldMap{
			"id":        &graphql.InputObjectFieldConfig{Type: graphql.NewNonNull(graphql.ID)},
			"visitDate": &graphql.InputObjectFieldConfig{Type: graphql.String},
			"tooth":     &graphql.InputObjectFieldConfig{Type: graphql.String},
			"procedure": &graphql.InputObjectFieldConfig{Type: graphql.String},
			"diagnosis": &graphql.InputObjectFieldConfig{Type: graphql.String},
			"fee":       &graphql.InputObjectFieldConfig{Type: graphql.Int},
			"staff":     &graphql.InputObjectFieldConfig{Type: graphql.String},
			"status":    &graphql.InputObjectFieldConfig{Type: graphql.String},
			"tags":      &graphql.InputObjectFieldConfig{Type: graphql.NewList(graphql.NewNonNull(graphql.String))},
		},
	})

	queryType := graphql.NewObject(graphql.ObjectConfig{
		Name: "Query",
		Fields: mergeFields(graphql.Fields{
			"health": &graphql.Field{
				Type:    healthType,
				Resolve: r.Health,
			},
			"dashboard": &graphql.Field{
				Type:    dashboardType,
				Resolve: r.Dashboard,
			},
			"patients": &graphql.Field{
				Type:    patientPageType,
				Args:    pageArgs(),
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
				Type: appointmentPageType,
				Args: mergeArgs(pageArgs(), graphql.FieldConfigArgument{
					"date": &graphql.ArgumentConfig{Type: graphql.String},
				}),
				Resolve: r.Appointments,
			},
			"treatments": &graphql.Field{
				Type: treatmentPageType,
				Args: mergeArgs(pageArgs(), graphql.FieldConfigArgument{
					"patientId": &graphql.ArgumentConfig{Type: graphql.ID},
				}),
				Resolve: r.Treatments,
			},
			"treatment": &graphql.Field{
				Type: treatmentType,
				Args: graphql.FieldConfigArgument{
					"id": &graphql.ArgumentConfig{Type: graphql.NewNonNull(graphql.ID)},
				},
				Resolve: r.Treatment,
			},
		}, mergeFields(
			saasQueryFields(r, sessionType, orgType, teamMemberType, subPlanType, usageType, apiKeyType, auditLogPageType),
			clinicalQueryFields(r, clinicalProfileType, clinicalChairType, clinicalStaffScheduleType, appointmentType),
			xrayQueryFields(r, xrayImageType),
		)),
	})

	mutationType := graphql.NewObject(graphql.ObjectConfig{
		Name: "Mutation",
		Fields: mergeFields(graphql.Fields{
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
			"createTreatment": &graphql.Field{
				Type: treatmentType,
				Args: graphql.FieldConfigArgument{
					"input": &graphql.ArgumentConfig{Type: graphql.NewNonNull(createTreatmentInput)},
				},
				Resolve: r.CreateTreatment,
			},
			"updateTreatment": &graphql.Field{
				Type: treatmentType,
				Args: graphql.FieldConfigArgument{
					"input": &graphql.ArgumentConfig{Type: graphql.NewNonNull(updateTreatmentInput)},
				},
				Resolve: r.UpdateTreatment,
			},
			"deleteTreatment": &graphql.Field{
				Type: treatmentType,
				Args: graphql.FieldConfigArgument{
					"id": &graphql.ArgumentConfig{Type: graphql.NewNonNull(graphql.ID)},
				},
				Resolve: r.DeleteTreatment,
			},
		}, mergeFields(
			saasMutationFields(r, orgType, teamMemberType, apiKeyCreatedType, planTierEnum, updateOrgInput, inviteInput, updateRoleInput, createKeyInput),
			clinicalMutationFields(r, clinicalProfileType, clinicalInsuranceType, appointmentType, clinicalReminderType, updateProfileInput, upsertInsuranceInput, updateApptInput, scheduleReminderInput),
			xrayMutationFields(r, xrayImageType, createXrayInput, updateXrayInput),
		)),
	})

	return graphql.NewSchema(graphql.SchemaConfig{
		Query:    queryType,
		Mutation: mutationType,
	})
}
