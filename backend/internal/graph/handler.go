package graph

import (
	"net/http"

	"github.com/graphql-go/handler"
	"github.com/pluszero/dental-care-api/internal/store"
)

func NewHTTPHandler(s *store.Store) (http.Handler, error) {
	schema, err := NewSchema(s)
	if err != nil {
		return nil, err
	}
	return handler.New(&handler.Config{
		Schema:   &schema,
		Pretty:   true,
		GraphiQL: true,
	}), nil
}
