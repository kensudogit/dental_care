package store

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/pluszero/dental-care-api/internal/models"
)

func (s *Store) seedSaas() {
	now := time.Now()
	org := models.Organization{
		ID:                 "org_demo",
		Name:               "??????????",
		Slug:               "sakura-dental",
		PlanTier:           models.PlanPro,
		SubscriptionStatus: models.SubActive,
		ChairCount:         3,
		Timezone:           "Asia/Tokyo",
		CreatedAt:          now.Add(-180 * 24 * time.Hour),
	}
	s.organizations[org.ID] = org
	s.currentOrgID = org.ID

	users := []models.User{
		{ID: "u1", Email: "kimura@sakura-dental.jp", Name: "?? ??"},
		{ID: "u2", Email: "hayashi@sakura-dental.jp", Name: "? ??"},
		{ID: "u3", Email: "sato@sakura-dental.jp", Name: "?? ?"},
		{ID: "u4", Email: "admin@pluszero.co.jp", Name: "PlusZero Admin"},
	}
	for _, u := range users {
		s.users[u.ID] = u
	}
	s.currentUserID = "u1"

	members := []models.TeamMember{
		{ID: "m1", UserID: "u1", OrgID: org.ID, Role: models.RoleOwner, JoinedAt: org.CreatedAt, LastActiveAt: now},
		{ID: "m2", UserID: "u2", OrgID: org.ID, Role: models.RoleAdmin, JoinedAt: org.CreatedAt.Add(30 * 24 * time.Hour), LastActiveAt: now.Add(-2 * time.Hour)},
		{ID: "m3", UserID: "u3", OrgID: org.ID, Role: models.RoleMember, JoinedAt: org.CreatedAt.Add(60 * 24 * time.Hour), LastActiveAt: now.Add(-24 * time.Hour)},
		{ID: "m4", UserID: "u4", OrgID: org.ID, Role: models.RoleViewer, JoinedAt: org.CreatedAt.Add(90 * 24 * time.Hour), LastActiveAt: now.Add(-72 * time.Hour)},
	}
	for _, m := range members {
		s.members[m.ID] = m
	}

	keyCreated := org.CreatedAt.Add(14 * 24 * time.Hour)
	s.apiKeys["key1"] = models.APIKey{
		ID: "key1", OrgID: org.ID, Name: "????", Prefix: "dc_live_",
		SecretHash: "demo", CreatedAt: keyCreated,
	}

	s.auditLogs = []models.AuditLogEntry{
		{ID: "log1", OrgID: org.ID, Action: "member.invited", Resource: "team", ActorName: "?? ??", IPAddress: "203.0.113.10", Metadata: `{"email":"sato@sakura-dental.jp","role":"MEMBER"}`, CreatedAt: now.Add(-48 * time.Hour)},
		{ID: "log2", OrgID: org.ID, Action: "plan.changed", Resource: "billing", ActorName: "?? ??", IPAddress: "203.0.113.10", Metadata: `{"from":"STARTER","to":"PRO"}`, CreatedAt: now.Add(-120 * time.Hour)},
		{ID: "log3", OrgID: org.ID, Action: "api_key.created", Resource: "api_key", ActorName: "? ??", IPAddress: "203.0.113.22", Metadata: `{"name":"????"}`, CreatedAt: now.Add(-14 * 24 * time.Hour)},
		{ID: "log4", OrgID: org.ID, Action: "organization.updated", Resource: "organization", ActorName: "?? ??", IPAddress: "203.0.113.10", Metadata: `{"field":"chairCount","value":"3"}`, CreatedAt: now.Add(-200 * time.Hour)},
	}
}

func (s *Store) currentOrg() models.Organization {
	if org, ok := s.organizations[s.currentOrgID]; ok {
		return org
	}
	return models.Organization{}
}

func (s *Store) currentUser() models.User {
	if u, ok := s.users[s.currentUserID]; ok {
		return u
	}
	return models.User{}
}

func (s *Store) currentMemberRole() models.MemberRole {
	for _, m := range s.members {
		if m.UserID == s.currentUserID && m.OrgID == s.currentOrgID {
			return m.Role
		}
	}
	return models.RoleViewer
}

func (s *Store) CurrentSession() models.Session {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return models.Session{
		User:         s.currentUser(),
		Organization: s.currentOrg(),
		Role:         s.currentMemberRole(),
	}
}

func (s *Store) GetOrganization() models.Organization {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.currentOrg()
}

func (s *Store) memberCount(orgID string) int {
	n := 0
	for _, m := range s.members {
		if m.OrgID == orgID {
			n++
		}
	}
	return n
}

func (s *Store) GetUser(id string) (models.User, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	u, ok := s.users[id]
	return u, ok
}

func (s *Store) ListTeamMembers() []models.TeamMember {
	s.mu.RLock()
	defer s.mu.RUnlock()
	out := make([]models.TeamMember, 0)
	for _, m := range s.members {
		if m.OrgID == s.currentOrgID {
			out = append(out, m)
		}
	}
	sort.Slice(out, func(i, j int) bool {
		return roleRank(out[i].Role) < roleRank(out[j].Role)
	})
	return out
}

func roleRank(r models.MemberRole) int {
	switch r {
	case models.RoleOwner:
		return 0
	case models.RoleAdmin:
		return 1
	case models.RoleMember:
		return 2
	default:
		return 3
	}
}

func (s *Store) SubscriptionPlans() []models.SubscriptionPlan {
	return []models.SubscriptionPlan{
		{
			Tier: models.PlanFree, Name: "Free", PriceMonthly: 0, PriceYearly: 0,
			MaxMembers: 2, MaxPatients: 50,
			Features: []models.PlanFeature{
				{Key: "appointments", Label: "Appointment scheduling", Included: true},
				{Key: "patients", Label: "Patient records", Included: true, Limit: intPtr(50)},
				{Key: "api", Label: "API access", Included: false},
				{Key: "audit", Label: "Audit log", Included: false},
			},
		},
		{
			Tier: models.PlanStarter, Name: "Starter", PriceMonthly: 9800, PriceYearly: 98000,
			MaxMembers: 5, MaxPatients: 500,
			Features: []models.PlanFeature{
				{Key: "appointments", Label: "Appointment scheduling", Included: true},
				{Key: "patients", Label: "Patient records", Included: true, Limit: intPtr(500)},
				{Key: "api", Label: "API access", Included: true, Limit: intPtr(1000)},
				{Key: "audit", Label: "Audit log (30 days)", Included: true},
			},
		},
		{
			Tier: models.PlanPro, Name: "Pro", PriceMonthly: 29800, PriceYearly: 298000,
			MaxMembers: 20, MaxPatients: 5000,
			Features: []models.PlanFeature{
				{Key: "appointments", Label: "Appointment scheduling", Included: true},
				{Key: "patients", Label: "Patient records", Included: true, Limit: intPtr(5000)},
				{Key: "api", Label: "API access", Included: true, Limit: intPtr(50000)},
				{Key: "audit", Label: "Audit log (1 year)", Included: true},
				{Key: "multi_location", Label: "Multi-location", Included: true},
			},
		},
		{
			Tier: models.PlanEnterprise, Name: "Enterprise", PriceMonthly: 98000, PriceYearly: 980000,
			MaxMembers: 999, MaxPatients: 999999,
			Features: []models.PlanFeature{
				{Key: "appointments", Label: "Appointment scheduling", Included: true},
				{Key: "patients", Label: "Patient records", Included: true},
				{Key: "api", Label: "API access", Included: true},
				{Key: "audit", Label: "Unlimited audit log", Included: true},
				{Key: "multi_location", Label: "Multi-location & SSO", Included: true},
				{Key: "sla", Label: "SLA & dedicated support", Included: true},
			},
		},
	}
}

func intPtr(n int) *int { return &n }

func (s *Store) Usage() models.UsageSummary {
	s.mu.RLock()
	defer s.mu.RUnlock()
	org := s.currentOrg()
	var plan models.SubscriptionPlan
	for _, p := range s.SubscriptionPlans() {
		if p.Tier == org.PlanTier {
			plan = p
			break
		}
	}
	return models.UsageSummary{
		Members:           s.memberCount(org.ID),
		MembersLimit:      plan.MaxMembers,
		Patients:          len(s.patients),
		PatientsLimit:     plan.MaxPatients,
		APICallsThisMonth: 1247,
		APICallsLimit:     apiLimit(org.PlanTier),
	}
}

func apiLimit(tier models.PlanTier) int {
	switch tier {
	case models.PlanFree:
		return 0
	case models.PlanStarter:
		return 1000
	case models.PlanPro:
		return 50000
	default:
		return 999999
	}
}

func (s *Store) ListAPIKeys() []models.APIKey {
	s.mu.RLock()
	defer s.mu.RUnlock()
	out := make([]models.APIKey, 0)
	for _, k := range s.apiKeys {
		if k.OrgID == s.currentOrgID && k.RevokedAt == nil {
			out = append(out, k)
		}
	}
	sort.Slice(out, func(i, j int) bool {
		return out[i].CreatedAt.After(out[j].CreatedAt)
	})
	return out
}

func (s *Store) ListAuditLogs(limit int) []models.AuditLogEntry {
	s.mu.RLock()
	defer s.mu.RUnlock()
	if limit <= 0 {
		limit = 50
	}
	out := make([]models.AuditLogEntry, 0)
	for _, e := range s.auditLogs {
		if e.OrgID == s.currentOrgID {
			out = append(out, e)
		}
	}
	sort.Slice(out, func(i, j int) bool {
		return out[i].CreatedAt.After(out[j].CreatedAt)
	})
	if len(out) > limit {
		out = out[:limit]
	}
	return out
}

func (s *Store) appendAudit(action, resource, metadata string) {
	s.auditLogs = append([]models.AuditLogEntry{{
		ID:        "log" + strconv.FormatInt(time.Now().UnixNano(), 10),
		OrgID:     s.currentOrgID,
		Action:    action,
		Resource:  resource,
		ActorName: s.currentUser().Name,
		IPAddress: "203.0.113.10",
		Metadata:  metadata,
		CreatedAt: time.Now(),
	}}, s.auditLogs...)
}

func (s *Store) UpdateOrganization(name, slug string, chairCount int, timezone string) models.Organization {
	s.mu.Lock()
	defer s.mu.Unlock()
	org := s.organizations[s.currentOrgID]
	if name != "" {
		org.Name = name
	}
	if slug != "" {
		org.Slug = slug
	}
	if chairCount > 0 {
		org.ChairCount = chairCount
	}
	if timezone != "" {
		org.Timezone = timezone
	}
	s.organizations[s.currentOrgID] = org
	s.appendAudit("organization.updated", "organization", fmt.Sprintf(`{"name":%q}`, org.Name))
	return org
}

func (s *Store) InviteTeamMember(email, name string, role models.MemberRole) (models.TeamMember, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	email = strings.TrimSpace(strings.ToLower(email))
	for _, u := range s.users {
		for _, m := range s.members {
			if m.OrgID == s.currentOrgID && u.Email == email {
				return models.TeamMember{}, fmt.Errorf("user already in org")
			}
		}
	}
	userID := "u" + strconv.FormatInt(time.Now().UnixNano(), 10)
	if name == "" {
		name = strings.Split(email, "@")[0]
	}
	s.users[userID] = models.User{ID: userID, Email: email, Name: name}
	m := models.TeamMember{
		ID:           "m" + strconv.FormatInt(time.Now().UnixNano(), 10),
		UserID:       userID,
		OrgID:        s.currentOrgID,
		Role:         role,
		JoinedAt:     time.Now(),
		LastActiveAt: time.Now(),
	}
	s.members[m.ID] = m
	s.appendAudit("member.invited", "team", fmt.Sprintf(`{"email":%q,"role":%q}`, email, role))
	return m, nil
}

func (s *Store) UpdateTeamMemberRole(id string, role models.MemberRole) (models.TeamMember, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	m, ok := s.members[id]
	if !ok || m.OrgID != s.currentOrgID {
		return models.TeamMember{}, fmt.Errorf("member not found")
	}
	if m.Role == models.RoleOwner && role != models.RoleOwner {
		hasOtherOwner := false
		for _, x := range s.members {
			if x.OrgID == s.currentOrgID && x.Role == models.RoleOwner && x.ID != id {
				hasOtherOwner = true
				break
			}
		}
		if !hasOtherOwner {
			return models.TeamMember{}, fmt.Errorf("cannot remove last owner")
		}
	}
	m.Role = role
	s.members[id] = m
	s.appendAudit("member.role_updated", "team", fmt.Sprintf(`{"id":%q,"role":%q}`, id, role))
	return m, nil
}

func (s *Store) RemoveTeamMember(id string) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	m, ok := s.members[id]
	if !ok || m.OrgID != s.currentOrgID {
		return fmt.Errorf("member not found")
	}
	if m.Role == models.RoleOwner {
		owners := 0
		for _, x := range s.members {
			if x.OrgID == s.currentOrgID && x.Role == models.RoleOwner {
				owners++
			}
		}
		if owners <= 1 {
			return fmt.Errorf("cannot remove last owner")
		}
	}
	delete(s.members, id)
	s.appendAudit("member.removed", "team", fmt.Sprintf(`{"id":%q}`, id))
	return nil
}

type APIKeyCreated struct {
	Key    models.APIKey
	Secret string
}

func (s *Store) CreateAPIKey(name string) (APIKeyCreated, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	name = strings.TrimSpace(name)
	if name == "" {
		name = "API key"
	}
	secret := randomSecret()
	key := models.APIKey{
		ID:         "key" + strconv.FormatInt(time.Now().UnixNano(), 10),
		OrgID:      s.currentOrgID,
		Name:       name,
		Prefix:     "dc_" + secret[:8] + "_",
		SecretHash: secret,
		CreatedAt:  time.Now(),
	}
	s.apiKeys[key.ID] = key
	s.appendAudit("api_key.created", "api_key", fmt.Sprintf(`{"name":%q}`, name))
	return APIKeyCreated{Key: key, Secret: secret}, nil
}

func (s *Store) RevokeAPIKey(id string) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	key, ok := s.apiKeys[id]
	if !ok || key.OrgID != s.currentOrgID {
		return fmt.Errorf("api key not found")
	}
	now := time.Now()
	key.RevokedAt = &now
	s.apiKeys[id] = key
	s.appendAudit("api_key.revoked", "api_key", fmt.Sprintf(`{"id":%q}`, id))
	return nil
}

func (s *Store) ChangePlan(tier models.PlanTier) models.Organization {
	s.mu.Lock()
	defer s.mu.Unlock()
	org := s.organizations[s.currentOrgID]
	prev := org.PlanTier
	org.PlanTier = tier
	s.organizations[s.currentOrgID] = org
	s.appendAudit("plan.changed", "billing", fmt.Sprintf(`{"from":%q,"to":%q}`, prev, tier))
	return org
}

func randomSecret() string {
	b := make([]byte, 24)
	_, _ = rand.Read(b)
	return hex.EncodeToString(b)
}
