package graph

import "github.com/graphql-go/graphql"

func mergeFields(a, b graphql.Fields) graphql.Fields {
	out := make(graphql.Fields, len(a)+len(b))
	for k, v := range a {
		out[k] = v
	}
	for k, v := range b {
		out[k] = v
	}
	return out
}
