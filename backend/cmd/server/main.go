package main

import (
	"log"
	"net/http"
	"os"

	"github.com/pluszero/dental-care-api/internal/api"
	"github.com/pluszero/dental-care-api/internal/store"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	s := store.New()
	r := api.NewRouter(s)

	addr := ":" + port
	log.Printf("[dental-care-api] listening on %s", addr)
	if err := http.ListenAndServe(addr, r); err != nil {
		log.Fatal(err)
	}
}
