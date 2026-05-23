package api

import (
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/pluszero/dental-care-api/internal/graph"
	"github.com/pluszero/dental-care-api/internal/store"
)

func NewRouter(s *store.Store) http.Handler {
	h := NewHandler(s)
	r := chi.NewRouter()
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins: corsOrigins(),
		AllowOriginFunc: func(_ *http.Request, origin string) bool {
			return railwayOriginAllowed(origin)
		},
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	r.Get("/health", h.Health)
	r.Get("/", h.Root)

	gql, err := graph.NewHTTPHandler(s)
	if err != nil {
		log.Fatalf("graphql schema: %v", err)
	}
	r.Handle("/graphql", gql)
	r.Get("/graphql/playground", func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, "/graphql", http.StatusFound)
	})

	// Legacy REST (optional); prefer GraphQL
	r.Route("/api/v1", func(r chi.Router) {
		r.Get("/dashboard", h.Dashboard)
		r.Route("/patients", func(r chi.Router) {
			r.Get("/", h.ListPatients)
			r.Post("/", h.CreatePatient)
			r.Get("/{id}", h.GetPatient)
		})
		r.Route("/appointments", func(r chi.Router) {
			r.Get("/", h.ListAppointments)
			r.Post("/", h.CreateAppointment)
		})
		r.Get("/treatments", h.ListTreatments)
	})

	return r
}
