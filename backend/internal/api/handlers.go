package api

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/pluszero/dental-care-api/internal/models"
	"github.com/pluszero/dental-care-api/internal/store"
)

type Handler struct {
	store *store.Store
}

func NewHandler(s *store.Store) *Handler {
	return &Handler{store: s}
}

func (h *Handler) Health(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, models.HealthResponse{
		OK:      true,
		Service: "dental-care-api",
		Version: "1.0.0",
	})
}

func (h *Handler) Root(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]any{
		"service": "dental-care-api",
		"role":    "api",
		"message": "GraphQL API. Open /graphql for GraphiQL. Use the Web app URL for the UI.",
		"links": map[string]string{
			"health":    "/health",
			"status":    "/status",
			"graphql":   "/graphql",
			"dashboard": "/api/v1/dashboard",
		},
	})
}

func (h *Handler) Status(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]any{
		"service": "dental-care-api",
		"role":    "api",
		"ok":      true,
		"hint":    "This is the Go API. /status on the Web service (Next.js) checks API_URL connectivity. If you see this JSON on your Web domain, redeploy the Web service with Root Directory empty and /railway.toml.",
		"health":  "/health",
	})
}

func (h *Handler) Dashboard(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, h.store.Dashboard())
}

func (h *Handler) ListPatients(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, h.store.ListPatients())
}

func (h *Handler) GetPatient(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	p, ok := h.store.GetPatient(id)
	if !ok {
		writeError(w, http.StatusNotFound, "patient not found")
		return
	}
	writeJSON(w, http.StatusOK, p)
}

func (h *Handler) CreatePatient(w http.ResponseWriter, r *http.Request) {
	var p models.Patient
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		writeError(w, http.StatusBadRequest, "invalid json")
		return
	}
	if p.ID == "" {
		p.ID = "p" + strconv.FormatInt(time.Now().UnixNano(), 10)
	}
	if p.ChartNo == "" {
		p.ChartNo = p.ID
	}
	created := h.store.CreatePatient(p)
	writeJSON(w, http.StatusCreated, created)
}

func (h *Handler) ListAppointments(w http.ResponseWriter, r *http.Request) {
	date := r.URL.Query().Get("date")
	if date == "" {
		date = time.Now().Format("2006-01-02")
	}
	writeJSON(w, http.StatusOK, h.store.ListAppointments(date))
}

func (h *Handler) CreateAppointment(w http.ResponseWriter, r *http.Request) {
	var a models.Appointment
	if err := json.NewDecoder(r.Body).Decode(&a); err != nil {
		writeError(w, http.StatusBadRequest, "invalid json")
		return
	}
	if a.ID == "" {
		a.ID = "a" + strconv.FormatInt(time.Now().UnixNano(), 10)
	}
	if a.Status == "" {
		a.Status = "pending"
	}
	created := h.store.CreateAppointment(a)
	writeJSON(w, http.StatusCreated, created)
}

func (h *Handler) ListTreatments(w http.ResponseWriter, r *http.Request) {
	patientID := r.URL.Query().Get("patientId")
	writeJSON(w, http.StatusOK, h.store.ListTreatments(patientID))
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

func writeError(w http.ResponseWriter, status int, msg string) {
	writeJSON(w, status, map[string]string{"error": msg})
}
