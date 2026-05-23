package graph

import (
	"fmt"
	"time"

	"github.com/graphql-go/graphql"
	"github.com/pluszero/dental-care-api/internal/models"
)

func saasTypes() (
	memberRoleEnum, planTierEnum, subStatusEnum *graphql.Enum,
	userType, orgType, teamMemberType, planFeatureType, subPlanType,
	usageType, apiKeyType, apiKeyCreatedType, auditType, sessionType *graphql.Object,
	updateOrgInput, inviteInput, updateRoleInput, createKeyInput *graphql.InputObject,
) {
	memberRoleEnum = graphql.NewEnum(graphql.EnumConfig{
		Name: "MemberRole",
		Values: graphql.EnumValueConfigMap{
			"OWNER":  &graphql.EnumValueConfig{Value: models.RoleOwner},
			"ADMIN":  &graphql.EnumValueConfig{Value: models.RoleAdmin},
			"MEMBER": &graphql.EnumValueConfig{Value: models.RoleMember},
			"VIEWER": &graphql.EnumValueConfig{Value: models.RoleViewer},
		},
	})
	planTierEnum = graphql.NewEnum(graphql.EnumConfig{
		Name: "PlanTier",
		Values: graphql.EnumValueConfigMap{
			"FREE":       &graphql.EnumValueConfig{Value: models.PlanFree},
			"STARTER":    &graphql.EnumValueConfig{Value: models.PlanStarter},
			"PRO":        &graphql.EnumValueConfig{Value: models.PlanPro},
			"ENTERPRISE": &graphql.EnumValueConfig{Value: models.PlanEnterprise},
		},
	})
	subStatusEnum = graphql.NewEnum(graphql.EnumConfig{
		Name: "SubscriptionStatus",
		Values: graphql.EnumValueConfigMap{
			"ACTIVE":   &graphql.EnumValueConfig{Value: models.SubActive},
			"TRIALING": &graphql.EnumValueConfig{Value: models.SubTrialing},
			"PAST_DUE": &graphql.EnumValueConfig{Value: models.SubPastDue},
			"CANCELED": &graphql.EnumValueConfig{Value: models.SubCanceled},
		},
	})

	userType = graphql.NewObject(graphql.ObjectConfig{
		Name: "User",
		Fields: graphql.Fields{
			"id":        &graphql.Field{Type: graphql.NewNonNull(graphql.ID)},
			"email":     &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"name":      &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"avatarUrl": &graphql.Field{Type: graphql.String},
		},
	})

	orgType = graphql.NewObject(graphql.ObjectConfig{
		Name: "Organization",
		Fields: graphql.Fields{
			"id":                 &graphql.Field{Type: graphql.NewNonNull(graphql.ID)},
			"name":               &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"slug":               &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"planTier":           &graphql.Field{Type: graphql.NewNonNull(planTierEnum)},
			"subscriptionStatus": &graphql.Field{Type: graphql.NewNonNull(subStatusEnum)},
			"chairCount":         &graphql.Field{Type: graphql.NewNonNull(graphql.Int)},
			"timezone":           &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"memberCount":        &graphql.Field{Type: graphql.NewNonNull(graphql.Int)},
			"createdAt":          &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
		},
	})

	teamMemberType = graphql.NewObject(graphql.ObjectConfig{
		Name: "TeamMember",
		Fields: graphql.Fields{
			"id":           &graphql.Field{Type: graphql.NewNonNull(graphql.ID)},
			"user":         &graphql.Field{Type: graphql.NewNonNull(userType)},
			"role":         &graphql.Field{Type: graphql.NewNonNull(memberRoleEnum)},
			"joinedAt":     &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"lastActiveAt": &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
		},
	})

	planFeatureType = graphql.NewObject(graphql.ObjectConfig{
		Name: "PlanFeature",
		Fields: graphql.Fields{
			"key":      &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"label":    &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"included": &graphql.Field{Type: graphql.NewNonNull(graphql.Boolean)},
			"limit":    &graphql.Field{Type: graphql.Int},
		},
	})

	subPlanType = graphql.NewObject(graphql.ObjectConfig{
		Name: "SubscriptionPlan",
		Fields: graphql.Fields{
			"tier":         &graphql.Field{Type: graphql.NewNonNull(planTierEnum)},
			"name":         &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"priceMonthly": &graphql.Field{Type: graphql.NewNonNull(graphql.Int)},
			"priceYearly":  &graphql.Field{Type: graphql.NewNonNull(graphql.Int)},
			"maxMembers":   &graphql.Field{Type: graphql.NewNonNull(graphql.Int)},
			"maxPatients":  &graphql.Field{Type: graphql.NewNonNull(graphql.Int)},
			"features":     &graphql.Field{Type: graphql.NewList(graphql.NewNonNull(planFeatureType))},
		},
	})

	usageType = graphql.NewObject(graphql.ObjectConfig{
		Name: "UsageSummary",
		Fields: graphql.Fields{
			"members":           &graphql.Field{Type: graphql.NewNonNull(graphql.Int)},
			"membersLimit":      &graphql.Field{Type: graphql.NewNonNull(graphql.Int)},
			"patients":          &graphql.Field{Type: graphql.NewNonNull(graphql.Int)},
			"patientsLimit":     &graphql.Field{Type: graphql.NewNonNull(graphql.Int)},
			"apiCallsThisMonth": &graphql.Field{Type: graphql.NewNonNull(graphql.Int)},
			"apiCallsLimit":     &graphql.Field{Type: graphql.NewNonNull(graphql.Int)},
		},
	})

	apiKeyType = graphql.NewObject(graphql.ObjectConfig{
		Name: "ApiKey",
		Fields: graphql.Fields{
			"id":         &graphql.Field{Type: graphql.NewNonNull(graphql.ID)},
			"name":       &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"prefix":     &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"lastUsedAt": &graphql.Field{Type: graphql.String},
			"createdAt":  &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
		},
	})

	apiKeyCreatedType = graphql.NewObject(graphql.ObjectConfig{
		Name: "ApiKeyCreated",
		Fields: graphql.Fields{
			"apiKey": &graphql.Field{Type: graphql.NewNonNull(apiKeyType)},
			"secret": &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
		},
	})

	auditType = graphql.NewObject(graphql.ObjectConfig{
		Name: "AuditLogEntry",
		Fields: graphql.Fields{
			"id":        &graphql.Field{Type: graphql.NewNonNull(graphql.ID)},
			"action":    &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"resource":  &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"actorName": &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"ipAddress": &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"metadata":  &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"createdAt": &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
		},
	})

	sessionType = graphql.NewObject(graphql.ObjectConfig{
		Name: "Session",
		Fields: graphql.Fields{
			"user":         &graphql.Field{Type: graphql.NewNonNull(userType)},
			"organization": &graphql.Field{Type: graphql.NewNonNull(orgType)},
			"role":         &graphql.Field{Type: graphql.NewNonNull(memberRoleEnum)},
		},
	})

	updateOrgInput = graphql.NewInputObject(graphql.InputObjectConfig{
		Name: "UpdateOrganizationInput",
		Fields: graphql.InputObjectConfigFieldMap{
			"name":       &graphql.InputObjectFieldConfig{Type: graphql.String},
			"slug":       &graphql.InputObjectFieldConfig{Type: graphql.String},
			"chairCount": &graphql.InputObjectFieldConfig{Type: graphql.Int},
			"timezone":   &graphql.InputObjectFieldConfig{Type: graphql.String},
		},
	})
	inviteInput = graphql.NewInputObject(graphql.InputObjectConfig{
		Name: "InviteTeamMemberInput",
		Fields: graphql.InputObjectConfigFieldMap{
			"email": &graphql.InputObjectFieldConfig{Type: graphql.NewNonNull(graphql.String)},
			"name":  &graphql.InputObjectFieldConfig{Type: graphql.String},
			"role":  &graphql.InputObjectFieldConfig{Type: graphql.NewNonNull(memberRoleEnum)},
		},
	})
	updateRoleInput = graphql.NewInputObject(graphql.InputObjectConfig{
		Name: "UpdateTeamMemberRoleInput",
		Fields: graphql.InputObjectConfigFieldMap{
			"id":   &graphql.InputObjectFieldConfig{Type: graphql.NewNonNull(graphql.ID)},
			"role": &graphql.InputObjectFieldConfig{Type: graphql.NewNonNull(memberRoleEnum)},
		},
	})
	createKeyInput = graphql.NewInputObject(graphql.InputObjectConfig{
		Name: "CreateApiKeyInput",
		Fields: graphql.InputObjectConfigFieldMap{
			"name": &graphql.InputObjectFieldConfig{Type: graphql.NewNonNull(graphql.String)},
		},
	})

	return
}

func saasQueryFields(r *Resolver, sessionType, orgType, teamMemberType, subPlanType, usageType, apiKeyType, auditType *graphql.Object) graphql.Fields {
	return graphql.Fields{
		"currentSession": &graphql.Field{Type: sessionType, Resolve: r.CurrentSession},
		"organization":   &graphql.Field{Type: orgType, Resolve: r.Organization},
		"teamMembers":    &graphql.Field{Type: graphql.NewList(graphql.NewNonNull(teamMemberType)), Resolve: r.TeamMembers},
		"subscriptionPlans": &graphql.Field{
			Type: graphql.NewList(graphql.NewNonNull(subPlanType)), Resolve: r.SubscriptionPlans,
		},
		"usage":   &graphql.Field{Type: usageType, Resolve: r.Usage},
		"apiKeys": &graphql.Field{Type: graphql.NewList(graphql.NewNonNull(apiKeyType)), Resolve: r.APIKeys},
		"auditLogs": &graphql.Field{
			Type: graphql.NewList(graphql.NewNonNull(auditType)),
			Args: graphql.FieldConfigArgument{
				"limit": &graphql.ArgumentConfig{Type: graphql.Int},
			},
			Resolve: r.AuditLogs,
		},
	}
}

func saasMutationFields(r *Resolver, orgType, teamMemberType, apiKeyCreatedType *graphql.Object, planTierEnum *graphql.Enum, updateOrgInput, inviteInput, updateRoleInput, createKeyInput *graphql.InputObject) graphql.Fields {
	return graphql.Fields{
		"updateOrganization": &graphql.Field{
			Type: orgType,
			Args: graphql.FieldConfigArgument{
				"input": &graphql.ArgumentConfig{Type: graphql.NewNonNull(updateOrgInput)},
			},
			Resolve: r.UpdateOrganization,
		},
		"inviteTeamMember": &graphql.Field{
			Type: teamMemberType,
			Args: graphql.FieldConfigArgument{
				"input": &graphql.ArgumentConfig{Type: graphql.NewNonNull(inviteInput)},
			},
			Resolve: r.InviteTeamMember,
		},
		"updateTeamMemberRole": &graphql.Field{
			Type: teamMemberType,
			Args: graphql.FieldConfigArgument{
				"input": &graphql.ArgumentConfig{Type: graphql.NewNonNull(updateRoleInput)},
			},
			Resolve: r.UpdateTeamMemberRole,
		},
		"removeTeamMember": &graphql.Field{
			Type: graphql.Boolean,
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{Type: graphql.NewNonNull(graphql.ID)},
			},
			Resolve: r.RemoveTeamMember,
		},
		"createApiKey": &graphql.Field{
			Type: apiKeyCreatedType,
			Args: graphql.FieldConfigArgument{
				"input": &graphql.ArgumentConfig{Type: graphql.NewNonNull(createKeyInput)},
			},
			Resolve: r.CreateAPIKey,
		},
		"revokeApiKey": &graphql.Field{
			Type: graphql.Boolean,
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{Type: graphql.NewNonNull(graphql.ID)},
			},
			Resolve: r.RevokeAPIKey,
		},
		"changePlan": &graphql.Field{
			Type: orgType,
			Args: graphql.FieldConfigArgument{
				"tier": &graphql.ArgumentConfig{Type: graphql.NewNonNull(planTierEnum)},
			},
			Resolve: r.ChangePlan,
		},
	}
}

func userToMap(u models.User) map[string]any {
	m := map[string]any{
		"id": u.ID, "email": u.Email, "name": u.Name,
	}
	if u.AvatarURL != "" {
		m["avatarUrl"] = u.AvatarURL
	}
	return m
}

func orgToMap(o models.Organization, memberCount int) map[string]any {
	return map[string]any{
		"id": o.ID, "name": o.Name, "slug": o.Slug,
		"planTier": string(o.PlanTier), "subscriptionStatus": string(o.SubscriptionStatus),
		"chairCount": o.ChairCount, "timezone": o.Timezone,
		"memberCount": memberCount, "createdAt": o.CreatedAt.Format(time.RFC3339),
	}
}

func teamMemberToMap(r *Resolver, m models.TeamMember) map[string]any {
	u, _ := r.store.GetUser(m.UserID)
	return map[string]any{
		"id": m.ID, "user": userToMap(u), "role": string(m.Role),
		"joinedAt": m.JoinedAt.Format(time.RFC3339),
		"lastActiveAt": m.LastActiveAt.Format(time.RFC3339),
	}
}

func apiKeyToMap(k models.APIKey) map[string]any {
	m := map[string]any{
		"id": k.ID, "name": k.Name, "prefix": k.Prefix,
		"createdAt": k.CreatedAt.Format(time.RFC3339),
	}
	if k.LastUsedAt != nil {
		m["lastUsedAt"] = k.LastUsedAt.Format(time.RFC3339)
	}
	return m
}

func parseRole(v any) models.MemberRole {
	if s, ok := v.(string); ok {
		return models.MemberRole(s)
	}
	if r, ok := v.(models.MemberRole); ok {
		return r
	}
	return models.RoleMember
}

func parsePlanTier(v any) models.PlanTier {
	if s, ok := v.(string); ok {
		return models.PlanTier(s)
	}
	if t, ok := v.(models.PlanTier); ok {
		return t
	}
	return models.PlanFree
}

func gqlErr(err error) error {
	return fmt.Errorf("%w", err)
}
