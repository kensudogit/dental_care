package graph

import "github.com/graphql-go/graphql"

func pageInfoType() *graphql.Object {
	return graphql.NewObject(graphql.ObjectConfig{
		Name: "PageInfo",
		Fields: graphql.Fields{
			"total":      &graphql.Field{Type: graphql.NewNonNull(graphql.Int)},
			"page":       &graphql.Field{Type: graphql.NewNonNull(graphql.Int)},
			"pageSize":   &graphql.Field{Type: graphql.NewNonNull(graphql.Int)},
			"totalPages": &graphql.Field{Type: graphql.NewNonNull(graphql.Int)},
		},
	})
}

func pageInfoMap(total, page, pageSize, totalPages int) map[string]any {
	return map[string]any{
		"total": total, "page": page, "pageSize": pageSize, "totalPages": totalPages,
	}
}

func pageArgs() graphql.FieldConfigArgument {
	return graphql.FieldConfigArgument{
		"page":     &graphql.ArgumentConfig{Type: graphql.Int, DefaultValue: 1},
		"pageSize": &graphql.ArgumentConfig{Type: graphql.Int, DefaultValue: 10},
	}
}

func pageListType(name string, itemType, pageInfo *graphql.Object) *graphql.Object {
	return graphql.NewObject(graphql.ObjectConfig{
		Name: name,
		Fields: graphql.Fields{
			"items":    &graphql.Field{Type: graphql.NewList(graphql.NewNonNull(itemType))},
			"pageInfo": &graphql.Field{Type: graphql.NewNonNull(pageInfo)},
		},
	})
}

func pageResult(items []map[string]any, total, page, pageSize, totalPages int) map[string]any {
	return map[string]any{
		"items":    items,
		"pageInfo": pageInfoMap(total, page, pageSize, totalPages),
	}
}

func pageFromArgs(p graphql.ResolveParams) (page, pageSize int) {
	page = toInt(p.Args["page"])
	pageSize = toInt(p.Args["pageSize"])
	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 10
	}
	return page, pageSize
}
