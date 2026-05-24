package graph

import (
	"github.com/graphql-go/graphql"
	"github.com/pluszero/dental-care-api/internal/models"
)

func clinicalTypes(r *Resolver) (
	patientProfileType, insuranceType, medicalHistoryType, allergyRecordType,
	familyMemberType, questionnaireType, emergencyContactType, visitRecordType,
	chairType, staffScheduleType, reminderType, reminderChannelEnum *graphql.Object,
	updateProfileInput, upsertInsuranceInput, updateApptInput, scheduleReminderInput *graphql.InputObject,
	appointmentType *graphql.Object,
) {
	reminderChannelEnumObj := graphql.NewEnum(graphql.EnumConfig{
		Name: "ReminderChannel",
		Values: graphql.EnumValueConfigMap{
			"SMS":   &graphql.EnumValueConfig{Value: models.ReminderSMS},
			"EMAIL": &graphql.EnumValueConfig{Value: models.ReminderEmail},
			"LINE":  &graphql.EnumValueConfig{Value: models.ReminderLINE},
		},
	})
	_ = reminderChannelEnumObj

	insuranceType = graphql.NewObject(graphql.ObjectConfig{
		Name: "InsuranceInfo",
		Fields: graphql.Fields{
			"insurerName":   &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"symbol":        &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"number":        &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"copayCategory": &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"validUntil":    &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
		},
	})

	medicalHistoryType = graphql.NewObject(graphql.ObjectConfig{
		Name: "MedicalHistory",
		Fields: graphql.Fields{
			"id":          &graphql.Field{Type: graphql.NewNonNull(graphql.ID)},
			"condition":   &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"diagnosedAt": &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"notes":       &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"resolved":    &graphql.Field{Type: graphql.NewNonNull(graphql.Boolean)},
		},
	})

	allergyRecordType = graphql.NewObject(graphql.ObjectConfig{
		Name: "AllergyRecord",
		Fields: graphql.Fields{
			"id":        &graphql.Field{Type: graphql.NewNonNull(graphql.ID)},
			"substance": &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"severity":  &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"reaction":  &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
		},
	})

	familyMemberType = graphql.NewObject(graphql.ObjectConfig{
		Name: "FamilyMember",
		Fields: graphql.Fields{
			"id":              &graphql.Field{Type: graphql.NewNonNull(graphql.ID)},
			"name":            &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"relationship":    &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"phone":           &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"linkedPatientId": &graphql.Field{Type: graphql.ID},
		},
	})

	questionnaireType = graphql.NewObject(graphql.ObjectConfig{
		Name: "Questionnaire",
		Fields: graphql.Fields{
			"id":                 &graphql.Field{Type: graphql.NewNonNull(graphql.ID)},
			"submittedAt":        &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"chiefComplaint":     &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"currentMedications": &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"smoking":            &graphql.Field{Type: graphql.NewNonNull(graphql.Boolean)},
			"pregnancy":          &graphql.Field{Type: graphql.NewNonNull(graphql.Boolean)},
			"dentalAnxiety":      &graphql.Field{Type: graphql.NewNonNull(graphql.Int)},
			"notes":              &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
		},
	})

	emergencyContactType = graphql.NewObject(graphql.ObjectConfig{
		Name: "EmergencyContact",
		Fields: graphql.Fields{
			"id":           &graphql.Field{Type: graphql.NewNonNull(graphql.ID)},
			"name":         &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"relationship": &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"phone":        &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"priority":     &graphql.Field{Type: graphql.NewNonNull(graphql.Int)},
		},
	})

	visitRecordType = graphql.NewObject(graphql.ObjectConfig{
		Name: "VisitRecord",
		Fields: graphql.Fields{
			"id":        &graphql.Field{Type: graphql.NewNonNull(graphql.ID)},
			"visitDate": &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"visitType": &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"summary":   &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"staff":     &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"status":    &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
		},
	})

	reminderType = graphql.NewObject(graphql.ObjectConfig{
		Name: "ReminderNotification",
		Fields: graphql.Fields{
			"id":          &graphql.Field{Type: graphql.NewNonNull(graphql.ID)},
			"channel":     &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"scheduledAt": &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"status":      &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"sentAt":      &graphql.Field{Type: graphql.String},
			"recipient":   &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
		},
	})

	chairType = graphql.NewObject(graphql.ObjectConfig{
		Name: "Chair",
		Fields: graphql.Fields{
			"id":     &graphql.Field{Type: graphql.NewNonNull(graphql.ID)},
			"number": &graphql.Field{Type: graphql.NewNonNull(graphql.Int)},
			"name":   &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"status": &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
		},
	})

	staffScheduleType = graphql.NewObject(graphql.ObjectConfig{
		Name: "StaffSchedule",
		Fields: graphql.Fields{
			"id":        &graphql.Field{Type: graphql.NewNonNull(graphql.ID)},
			"staffId":   &graphql.Field{Type: graphql.NewNonNull(graphql.ID)},
			"staffName": &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"role":      &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"date":      &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"startTime": &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"endTime":   &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"notes":     &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
		},
	})

	patientProfileType = graphql.NewObject(graphql.ObjectConfig{
		Name: "PatientProfile",
		Fields: graphql.Fields{
			"id":        &graphql.Field{Type: graphql.NewNonNull(graphql.ID)},
			"chartNo":   &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"name":      &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"kana":      &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"birthDate": &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"gender":    &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"phone":     &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"email":     &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"address":   &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"allergies": &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"notes":     &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"lastVisit": &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"createdAt": &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"insurance": &graphql.Field{Type: insuranceType},
			"medicalHistories": &graphql.Field{
				Type: graphql.NewList(graphql.NewNonNull(medicalHistoryType)),
			},
			"allergyRecords": &graphql.Field{
				Type: graphql.NewList(graphql.NewNonNull(allergyRecordType)),
			},
			"familyMembers": &graphql.Field{
				Type: graphql.NewList(graphql.NewNonNull(familyMemberType)),
			},
			"questionnaires": &graphql.Field{
				Type: graphql.NewList(graphql.NewNonNull(questionnaireType)),
			},
			"emergencyContacts": &graphql.Field{
				Type: graphql.NewList(graphql.NewNonNull(emergencyContactType)),
			},
			"visitHistory": &graphql.Field{
				Type: graphql.NewList(graphql.NewNonNull(visitRecordType)),
			},
		},
	})

	appointmentType = graphql.NewObject(graphql.ObjectConfig{
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
			"staffRole":   &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"notes":       &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"noShow":      &graphql.Field{Type: graphql.NewNonNull(graphql.Boolean)},
			"cancelReason": &graphql.Field{Type: graphql.String},
			"cancelledAt":  &graphql.Field{Type: graphql.String},
			"reminders": &graphql.Field{
				Type: graphql.NewList(graphql.NewNonNull(reminderType)),
				Resolve: func(p graphql.ResolveParams) (any, error) {
					m, _ := p.Source.(map[string]any)
					id, _ := m["id"].(string)
					out := make([]map[string]any, 0)
					for _, rem := range r.store.ListReminders(id) {
						out = append(out, reminderToMap(rem))
					}
					return out, nil
				},
			},
		},
	})

	updateProfileInput = graphql.NewInputObject(graphql.InputObjectConfig{
		Name: "UpdatePatientProfileInput",
		Fields: graphql.InputObjectConfigFieldMap{
			"id":      &graphql.InputObjectFieldConfig{Type: graphql.NewNonNull(graphql.ID)},
			"gender":  &graphql.InputObjectFieldConfig{Type: graphql.String},
			"address": &graphql.InputObjectFieldConfig{Type: graphql.String},
			"phone":   &graphql.InputObjectFieldConfig{Type: graphql.String},
			"email":   &graphql.InputObjectFieldConfig{Type: graphql.String},
			"notes":   &graphql.InputObjectFieldConfig{Type: graphql.String},
		},
	})

	upsertInsuranceInput = graphql.NewInputObject(graphql.InputObjectConfig{
		Name: "UpsertInsuranceInput",
		Fields: graphql.InputObjectConfigFieldMap{
			"patientId":     &graphql.InputObjectFieldConfig{Type: graphql.NewNonNull(graphql.ID)},
			"insurerName":   &graphql.InputObjectFieldConfig{Type: graphql.NewNonNull(graphql.String)},
			"symbol":        &graphql.InputObjectFieldConfig{Type: graphql.NewNonNull(graphql.String)},
			"number":        &graphql.InputObjectFieldConfig{Type: graphql.NewNonNull(graphql.String)},
			"copayCategory": &graphql.InputObjectFieldConfig{Type: graphql.NewNonNull(graphql.String)},
			"validUntil":    &graphql.InputObjectFieldConfig{Type: graphql.NewNonNull(graphql.String)},
		},
	})

	updateApptInput = graphql.NewInputObject(graphql.InputObjectConfig{
		Name: "UpdateAppointmentInput",
		Fields: graphql.InputObjectConfigFieldMap{
			"id":      &graphql.InputObjectFieldConfig{Type: graphql.NewNonNull(graphql.ID)},
			"chair":   &graphql.InputObjectFieldConfig{Type: graphql.Int},
			"startAt": &graphql.InputObjectFieldConfig{Type: graphql.String},
			"endAt":   &graphql.InputObjectFieldConfig{Type: graphql.String},
			"type":    &graphql.InputObjectFieldConfig{Type: graphql.String},
			"staff":   &graphql.InputObjectFieldConfig{Type: graphql.String},
			"notes":   &graphql.InputObjectFieldConfig{Type: graphql.String},
			"status":  &graphql.InputObjectFieldConfig{Type: graphql.String},
		},
	})

	scheduleReminderInput = graphql.NewInputObject(graphql.InputObjectConfig{
		Name: "ScheduleReminderInput",
		Fields: graphql.InputObjectConfigFieldMap{
			"appointmentId": &graphql.InputObjectFieldConfig{Type: graphql.NewNonNull(graphql.ID)},
			"channel":       &graphql.InputObjectFieldConfig{Type: graphql.NewNonNull(graphql.String)},
			"scheduledAt":   &graphql.InputObjectFieldConfig{Type: graphql.NewNonNull(graphql.String)},
			"recipient":     &graphql.InputObjectFieldConfig{Type: graphql.NewNonNull(graphql.String)},
		},
	})

	return
}

func clinicalQueryFields(
	r *Resolver,
	patientProfileType, chairType, staffScheduleType, appointmentType *graphql.Object,
) graphql.Fields {
	return graphql.Fields{
		"patientProfile": &graphql.Field{
			Type: patientProfileType,
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{Type: graphql.NewNonNull(graphql.ID)},
			},
			Resolve: r.PatientProfile,
		},
		"searchPatients": &graphql.Field{
			Type: graphql.NewList(graphql.NewNonNull(patientProfileType)),
			Args: graphql.FieldConfigArgument{
				"query": &graphql.ArgumentConfig{Type: graphql.String},
			},
			Resolve: r.SearchPatients,
		},
		"chairs": &graphql.Field{
			Type:    graphql.NewList(graphql.NewNonNull(chairType)),
			Resolve: r.Chairs,
		},
		"staffSchedules": &graphql.Field{
			Type: graphql.NewList(graphql.NewNonNull(staffScheduleType)),
			Args: graphql.FieldConfigArgument{
				"date": &graphql.ArgumentConfig{Type: graphql.String},
			},
			Resolve: r.StaffSchedules,
		},
		"appointmentCalendar": &graphql.Field{
			Type: graphql.NewList(graphql.NewNonNull(appointmentType)),
			Args: graphql.FieldConfigArgument{
				"from": &graphql.ArgumentConfig{Type: graphql.NewNonNull(graphql.String)},
				"to":   &graphql.ArgumentConfig{Type: graphql.NewNonNull(graphql.String)},
			},
			Resolve: r.AppointmentCalendar,
		},
		"noShowAppointments": &graphql.Field{
			Type:    graphql.NewList(graphql.NewNonNull(appointmentType)),
			Resolve: r.NoShowAppointments,
		},
	}
}

func clinicalMutationFields(
	r *Resolver,
	patientProfileType, insuranceType, appointmentType, reminderType *graphql.Object,
	updateProfileInput, upsertInsuranceInput, updateApptInput, scheduleReminderInput *graphql.InputObject,
) graphql.Fields {
	return graphql.Fields{
		"updatePatientProfile": &graphql.Field{
			Type: patientProfileType,
			Args: graphql.FieldConfigArgument{
				"input": &graphql.ArgumentConfig{Type: graphql.NewNonNull(updateProfileInput)},
			},
			Resolve: r.UpdatePatientProfile,
		},
		"upsertInsurance": &graphql.Field{
			Type: insuranceType,
			Args: graphql.FieldConfigArgument{
				"input": &graphql.ArgumentConfig{Type: graphql.NewNonNull(upsertInsuranceInput)},
			},
			Resolve: r.UpsertInsurance,
		},
		"updateAppointment": &graphql.Field{
			Type: appointmentType,
			Args: graphql.FieldConfigArgument{
				"input": &graphql.ArgumentConfig{Type: graphql.NewNonNull(updateApptInput)},
			},
			Resolve: r.UpdateAppointment,
		},
		"cancelAppointment": &graphql.Field{
			Type: appointmentType,
			Args: graphql.FieldConfigArgument{
				"id":     &graphql.ArgumentConfig{Type: graphql.NewNonNull(graphql.ID)},
				"reason": &graphql.ArgumentConfig{Type: graphql.String},
			},
			Resolve: r.CancelAppointment,
		},
		"markAppointmentNoShow": &graphql.Field{
			Type: appointmentType,
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{Type: graphql.NewNonNull(graphql.ID)},
			},
			Resolve: r.MarkAppointmentNoShow,
		},
		"scheduleReminder": &graphql.Field{
			Type: reminderType,
			Args: graphql.FieldConfigArgument{
				"input": &graphql.ArgumentConfig{Type: graphql.NewNonNull(scheduleReminderInput)},
			},
			Resolve: r.ScheduleReminder,
		},
	}
}

func patientProfileToMap(r *Resolver, prof models.PatientProfile) map[string]any {
	m := map[string]any{
		"id": prof.ID, "chartNo": prof.ChartNo, "name": prof.Name, "kana": prof.Kana,
		"birthDate": prof.BirthDate, "gender": prof.Gender, "phone": prof.Phone,
		"email": prof.Email, "address": prof.Address, "allergies": prof.Allergies,
		"notes": prof.Notes, "lastVisit": prof.LastVisit,
		"createdAt": prof.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
	}
	if ins, ok := r.store.GetInsurance(prof.ID); ok {
		m["insurance"] = insuranceToMap(ins)
	}
	pid := prof.ID
	mh := make([]map[string]any, 0)
	for _, x := range r.store.ListMedicalHistories(pid) {
		mh = append(mh, map[string]any{
			"id": x.ID, "condition": x.Condition, "diagnosedAt": x.DiagnosedAt,
			"notes": x.Notes, "resolved": x.Resolved,
		})
	}
	m["medicalHistories"] = mh
	ar := make([]map[string]any, 0)
	for _, x := range r.store.ListAllergyRecords(pid) {
		ar = append(ar, map[string]any{
			"id": x.ID, "substance": x.Substance, "severity": x.Severity, "reaction": x.Reaction,
		})
	}
	m["allergyRecords"] = ar
	fm := make([]map[string]any, 0)
	for _, x := range r.store.ListFamilyMembers(pid) {
		item := map[string]any{
			"id": x.ID, "name": x.Name, "relationship": x.Relationship, "phone": x.Phone,
		}
		if x.LinkedPatientID != "" {
			item["linkedPatientId"] = x.LinkedPatientID
		}
		fm = append(fm, item)
	}
	m["familyMembers"] = fm
	qs := make([]map[string]any, 0)
	for _, x := range r.store.ListQuestionnaires(pid) {
		qs = append(qs, map[string]any{
			"id": x.ID, "submittedAt": x.SubmittedAt, "chiefComplaint": x.ChiefComplaint,
			"currentMedications": x.CurrentMedications, "smoking": x.Smoking,
			"pregnancy": x.Pregnancy, "dentalAnxiety": x.DentalAnxiety, "notes": x.Notes,
		})
	}
	m["questionnaires"] = qs
	ec := make([]map[string]any, 0)
	for _, x := range r.store.ListEmergencyContacts(pid) {
		ec = append(ec, map[string]any{
			"id": x.ID, "name": x.Name, "relationship": x.Relationship,
			"phone": x.Phone, "priority": x.Priority,
		})
	}
	m["emergencyContacts"] = ec
	vh := make([]map[string]any, 0)
	for _, x := range r.store.ListVisitRecords(pid) {
		vh = append(vh, map[string]any{
			"id": x.ID, "visitDate": x.VisitDate, "visitType": x.VisitType,
			"summary": x.Summary, "staff": x.Staff, "status": x.Status,
		})
	}
	m["visitHistory"] = vh
	return m
}

func insuranceToMap(ins models.InsuranceInfo) map[string]any {
	return map[string]any{
		"insurerName": ins.InsurerName, "symbol": ins.Symbol, "number": ins.Number,
		"copayCategory": ins.CopayCategory, "validUntil": ins.ValidUntil,
	}
}

func reminderToMap(rem models.ReminderNotification) map[string]any {
	m := map[string]any{
		"id": rem.ID, "channel": string(rem.Channel),
		"scheduledAt": rem.ScheduledAt, "status": rem.Status, "recipient": rem.Recipient,
	}
	if rem.SentAt != "" {
		m["sentAt"] = rem.SentAt
	}
	return m
}

func appointmentToMapFull(a models.Appointment) map[string]any {
	m := map[string]any{
		"id": a.ID, "patientId": a.PatientID, "patientName": a.Patient,
		"chair": a.Chair, "startAt": a.StartAt, "endAt": a.EndAt,
		"type": a.Type, "status": a.Status, "staff": a.Staff,
		"staffRole": a.StaffRole, "notes": a.Notes, "noShow": a.NoShow,
	}
	if a.StaffRole == "" {
		m["staffRole"] = "dentist"
	}
	if a.CancelReason != "" {
		m["cancelReason"] = a.CancelReason
	}
	if a.CancelledAt != "" {
		m["cancelledAt"] = a.CancelledAt
	}
	return m
}

func parseReminderChannel(v any) models.ReminderChannel {
	if s, ok := v.(string); ok {
		return models.ReminderChannel(s)
	}
	return models.ReminderEmail
}
