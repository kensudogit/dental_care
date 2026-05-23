package models

import "time"

type MemberRole string

const (
	RoleOwner  MemberRole = "OWNER"
	RoleAdmin  MemberRole = "ADMIN"
	RoleMember MemberRole = "MEMBER"
	RoleViewer MemberRole = "VIEWER"
)

type PlanTier string

const (
	PlanFree       PlanTier = "FREE"
	PlanStarter    PlanTier = "STARTER"
	PlanPro        PlanTier = "PRO"
	PlanEnterprise PlanTier = "ENTERPRISE"
)

type SubscriptionStatus string

const (
	SubActive    SubscriptionStatus = "ACTIVE"
	SubTrialing  SubscriptionStatus = "TRIALING"
	SubPastDue   SubscriptionStatus = "PAST_DUE"
	SubCanceled  SubscriptionStatus = "CANCELED"
)

type Organization struct {
	ID                 string             `json:"id"`
	Name               string             `json:"name"`
	Slug               string             `json:"slug"`
	PlanTier           PlanTier           `json:"planTier"`
	SubscriptionStatus SubscriptionStatus `json:"subscriptionStatus"`
	ChairCount         int                `json:"chairCount"`
	Timezone           string             `json:"timezone"`
	CreatedAt          time.Time          `json:"createdAt"`
}

type User struct {
	ID        string `json:"id"`
	Email     string `json:"email"`
	Name      string `json:"name"`
	AvatarURL string `json:"avatarUrl,omitempty"`
}

type TeamMember struct {
	ID           string     `json:"id"`
	UserID       string     `json:"userId"`
	OrgID        string     `json:"orgId"`
	Role         MemberRole `json:"role"`
	JoinedAt     time.Time  `json:"joinedAt"`
	LastActiveAt time.Time  `json:"lastActiveAt"`
}

type PlanFeature struct {
	Key      string `json:"key"`
	Label    string `json:"label"`
	Included bool   `json:"included"`
	Limit    *int   `json:"limit,omitempty"`
}

type SubscriptionPlan struct {
	Tier         PlanTier      `json:"tier"`
	Name         string        `json:"name"`
	PriceMonthly int           `json:"priceMonthly"`
	PriceYearly  int           `json:"priceYearly"`
	MaxMembers   int           `json:"maxMembers"`
	MaxPatients  int           `json:"maxPatients"`
	Features     []PlanFeature `json:"features"`
}

type UsageSummary struct {
	Members           int `json:"members"`
	MembersLimit      int `json:"membersLimit"`
	Patients          int `json:"patients"`
	PatientsLimit     int `json:"patientsLimit"`
	APICallsThisMonth int `json:"apiCallsThisMonth"`
	APICallsLimit     int `json:"apiCallsLimit"`
}

type APIKey struct {
	ID         string     `json:"id"`
	OrgID      string     `json:"orgId"`
	Name       string     `json:"name"`
	Prefix     string     `json:"prefix"`
	SecretHash string     `json:"-"`
	LastUsedAt *time.Time `json:"lastUsedAt,omitempty"`
	CreatedAt  time.Time  `json:"createdAt"`
	RevokedAt  *time.Time `json:"revokedAt,omitempty"`
}

type AuditLogEntry struct {
	ID         string    `json:"id"`
	OrgID      string    `json:"orgId"`
	Action     string    `json:"action"`
	Resource   string    `json:"resource"`
	ActorName  string    `json:"actorName"`
	IPAddress  string    `json:"ipAddress"`
	Metadata   string    `json:"metadata"`
	CreatedAt  time.Time `json:"createdAt"`
}

type Session struct {
	User         User         `json:"user"`
	Organization Organization `json:"organization"`
	Role         MemberRole   `json:"role"`
}
