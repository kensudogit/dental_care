package graph

import (
	"time"

	"github.com/graphql-go/graphql"
	"github.com/pluszero/dental-care-api/internal/models"
)

func xrayTypes() (
	xrayType *graphql.Object,
	xrayImageTypeEnum *graphql.Enum,
	createXrayInput, updateXrayInput *graphql.InputObject,
) {
	xrayImageTypeEnum = graphql.NewEnum(graphql.EnumConfig{
		Name: "XrayImageType",
		Values: graphql.EnumValueConfigMap{
			"PANORAMIC":     &graphql.EnumValueConfig{Value: "PANORAMIC"},
			"PERIAPICAL":    &graphql.EnumValueConfig{Value: "PERIAPICAL"},
			"BITEWING":      &graphql.EnumValueConfig{Value: "BITEWING"},
			"CEPHALOMETRIC": &graphql.EnumValueConfig{Value: "CEPHALOMETRIC"},
		},
	})

	xrayType = graphql.NewObject(graphql.ObjectConfig{
		Name: "XrayImage",
		Fields: graphql.Fields{
			"id":          &graphql.Field{Type: graphql.NewNonNull(graphql.ID)},
			"patientId":   &graphql.Field{Type: graphql.NewNonNull(graphql.ID)},
			"title":       &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"imageUrl":    &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"imageType":   &graphql.Field{Type: graphql.NewNonNull(xrayImageTypeEnum)},
			"toothRegion": &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"takenAt":     &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"notes":       &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"createdAt":   &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"updatedAt":   &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
		},
	})

	createXrayInput = graphql.NewInputObject(graphql.InputObjectConfig{
		Name: "CreateXrayImageInput",
		Fields: graphql.InputObjectConfigFieldMap{
			"patientId":   &graphql.InputObjectFieldConfig{Type: graphql.NewNonNull(graphql.ID)},
			"title":       &graphql.InputObjectFieldConfig{Type: graphql.NewNonNull(graphql.String)},
			"imageUrl":    &graphql.InputObjectFieldConfig{Type: graphql.NewNonNull(graphql.String)},
			"imageType":   &graphql.InputObjectFieldConfig{Type: xrayImageTypeEnum},
			"toothRegion": &graphql.InputObjectFieldConfig{Type: graphql.String},
			"takenAt":     &graphql.InputObjectFieldConfig{Type: graphql.String},
			"notes":       &graphql.InputObjectFieldConfig{Type: graphql.String},
		},
	})

	updateXrayInput = graphql.NewInputObject(graphql.InputObjectConfig{
		Name: "UpdateXrayImageInput",
		Fields: graphql.InputObjectConfigFieldMap{
			"id":          &graphql.InputObjectFieldConfig{Type: graphql.NewNonNull(graphql.ID)},
			"title":       &graphql.InputObjectFieldConfig{Type: graphql.String},
			"imageUrl":    &graphql.InputObjectFieldConfig{Type: graphql.String},
			"imageType":   &graphql.InputObjectFieldConfig{Type: xrayImageTypeEnum},
			"toothRegion": &graphql.InputObjectFieldConfig{Type: graphql.String},
			"takenAt":     &graphql.InputObjectFieldConfig{Type: graphql.String},
			"notes":       &graphql.InputObjectFieldConfig{Type: graphql.String},
		},
	})

	return
}

func xrayQueryFields(r *Resolver, xrayType *graphql.Object) graphql.Fields {
	return graphql.Fields{
		"xrayImages": &graphql.Field{
			Type: graphql.NewList(graphql.NewNonNull(xrayType)),
			Args: graphql.FieldConfigArgument{
				"patientId": &graphql.ArgumentConfig{Type: graphql.ID},
			},
			Resolve: r.XrayImages,
		},
		"xrayImage": &graphql.Field{
			Type: xrayType,
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{Type: graphql.NewNonNull(graphql.ID)},
			},
			Resolve: r.XrayImage,
		},
	}
}

func xrayMutationFields(r *Resolver, xrayType *graphql.Object, createXrayInput, updateXrayInput *graphql.InputObject) graphql.Fields {
	return graphql.Fields{
		"createXrayImage": &graphql.Field{
			Type: xrayType,
			Args: graphql.FieldConfigArgument{
				"input": &graphql.ArgumentConfig{Type: graphql.NewNonNull(createXrayInput)},
			},
			Resolve: r.CreateXrayImage,
		},
		"updateXrayImage": &graphql.Field{
			Type: xrayType,
			Args: graphql.FieldConfigArgument{
				"input": &graphql.ArgumentConfig{Type: graphql.NewNonNull(updateXrayInput)},
			},
			Resolve: r.UpdateXrayImage,
		},
		"deleteXrayImage": &graphql.Field{
			Type: xrayType,
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{Type: graphql.NewNonNull(graphql.ID)},
			},
			Resolve: r.DeleteXrayImage,
		},
	}
}

func xrayToMap(x models.XrayImage) map[string]any {
	return map[string]any{
		"id": x.ID, "patientId": x.PatientID, "title": x.Title,
		"imageUrl": x.ImageURL, "imageType": string(x.ImageType),
		"toothRegion": x.ToothRegion, "takenAt": x.TakenAt, "notes": x.Notes,
		"createdAt": x.CreatedAt.Format(time.RFC3339),
		"updatedAt": x.UpdatedAt.Format(time.RFC3339),
	}
}
