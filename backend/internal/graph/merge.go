package graph

import "github.com/graphql-go/graphql"

func mergeFields(parts ...graphql.Fields) graphql.Fields {
	n := 0
	for _, p := range parts {
		n += len(p)
	}
	out := make(graphql.Fields, n)
	for _, p := range parts {
		for k, v := range p {
			out[k] = v
		}
	}
	return out
}

func mergeArgs(parts ...graphql.FieldConfigArgument) graphql.FieldConfigArgument {
	n := 0
	for _, p := range parts {
		n += len(p)
	}
	out := make(graphql.FieldConfigArgument, n)
	for _, p := range parts {
		for k, v := range p {
			out[k] = v
		}
	}
	return out
}
