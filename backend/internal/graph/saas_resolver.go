package graph

import (
	"github.com/graphql-go/graphql"
	"github.com/pluszero/dental-care-api/internal/models"
)

func (r *Resolver) CurrentSession(p graphql.ResolveParams) (any, error) {
	s := r.store.CurrentSession()
	return map[string]any{
		"user":         userToMap(s.User),
		"organization": orgToMap(s.Organization, r.storeMemberCount()),
		"role":         s.Role,
	}, nil
}

func (r *Resolver) Organization(p graphql.ResolveParams) (any, error) {
	o := r.store.GetOrganization()
	return orgToMap(o, r.storeMemberCount()), nil
}

func (r *Resolver) storeMemberCount() int {
	members := r.store.ListTeamMembers()
	return len(members)
}

func (r *Resolver) TeamMembers(p graphql.ResolveParams) (any, error) {
	out := make([]map[string]any, 0)
	for _, m := range r.store.ListTeamMembers() {
		out = append(out, teamMemberToMap(r, m))
	}
	return out, nil
}

func (r *Resolver) SubscriptionPlans(p graphql.ResolveParams) (any, error) {
	out := make([]map[string]any, 0)
	for _, plan := range r.store.SubscriptionPlans() {
		features := make([]map[string]any, 0, len(plan.Features))
		for _, f := range plan.Features {
			fm := map[string]any{
				"key": f.Key, "label": f.Label, "included": f.Included,
			}
			if f.Limit != nil {
				fm["limit"] = *f.Limit
			}
			features = append(features, fm)
		}
		out = append(out, map[string]any{
			"tier": plan.Tier, "name": plan.Name,
			"priceMonthly": plan.PriceMonthly, "priceYearly": plan.PriceYearly,
			"maxMembers": plan.MaxMembers, "maxPatients": plan.MaxPatients,
			"features": features,
		})
	}
	return out, nil
}

func (r *Resolver) Usage(p graphql.ResolveParams) (any, error) {
	u := r.store.Usage()
	return map[string]any{
		"members": u.Members, "membersLimit": u.MembersLimit,
		"patients": u.Patients, "patientsLimit": u.PatientsLimit,
		"apiCallsThisMonth": u.APICallsThisMonth, "apiCallsLimit": u.APICallsLimit,
	}, nil
}

func (r *Resolver) APIKeys(p graphql.ResolveParams) (any, error) {
	out := make([]map[string]any, 0)
	for _, k := range r.store.ListAPIKeys() {
		out = append(out, apiKeyToMap(k))
	}
	return out, nil
}

func (r *Resolver) AuditLogs(p graphql.ResolveParams) (any, error) {
	page, pageSize := pageFromArgs(p)
	result := r.store.PaginateAuditLogs(page, pageSize)
	items := make([]map[string]any, 0, len(result.Items))
	for _, e := range result.Items {
		items = append(items, map[string]any{
			"id": e.ID, "action": e.Action, "resource": e.Resource,
			"actorName": e.ActorName, "ipAddress": e.IPAddress,
			"metadata": e.Metadata, "createdAt": e.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		})
	}
	pi := result.PageInfo
	return pageResult(items, pi.Total, pi.Page, pi.PageSize, pi.TotalPages), nil
}

func (r *Resolver) UpdateOrganization(p graphql.ResolveParams) (any, error) {
	in, _ := p.Args["input"].(map[string]any)
	o := r.store.UpdateOrganization(str(in, "name"), str(in, "slug"), toInt(in["chairCount"]), str(in, "timezone"))
	return orgToMap(o, r.storeMemberCount()), nil
}

func (r *Resolver) InviteTeamMember(p graphql.ResolveParams) (any, error) {
	in, _ := p.Args["input"].(map[string]any)
	m, err := r.store.InviteTeamMember(str(in, "email"), str(in, "name"), parseRole(in["role"]))
	if err != nil {
		return nil, gqlErr(err)
	}
	return teamMemberToMap(r, m), nil
}

func (r *Resolver) UpdateTeamMemberRole(p graphql.ResolveParams) (any, error) {
	in, _ := p.Args["input"].(map[string]any)
	m, err := r.store.UpdateTeamMemberRole(str(in, "id"), parseRole(in["role"]))
	if err != nil {
		return nil, gqlErr(err)
	}
	return teamMemberToMap(r, m), nil
}

func (r *Resolver) RemoveTeamMember(p graphql.ResolveParams) (any, error) {
	id, _ := p.Args["id"].(string)
	if err := r.store.RemoveTeamMember(id); err != nil {
		return nil, gqlErr(err)
	}
	return true, nil
}

func (r *Resolver) CreateAPIKey(p graphql.ResolveParams) (any, error) {
	in, _ := p.Args["input"].(map[string]any)
	created, err := r.store.CreateAPIKey(str(in, "name"))
	if err != nil {
		return nil, gqlErr(err)
	}
	return map[string]any{
		"apiKey": apiKeyToMap(created.Key),
		"secret": created.Secret,
	}, nil
}

func (r *Resolver) RevokeAPIKey(p graphql.ResolveParams) (any, error) {
	id, _ := p.Args["id"].(string)
	if err := r.store.RevokeAPIKey(id); err != nil {
		return nil, gqlErr(err)
	}
	return true, nil
}

func (r *Resolver) ChangePlan(p graphql.ResolveParams) (any, error) {
	tier := parsePlanTier(p.Args["tier"])
	o := r.store.ChangePlan(models.PlanTier(tier))
	return orgToMap(o, r.storeMemberCount()), nil
}
