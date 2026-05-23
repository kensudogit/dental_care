export function isLegacySchemaError(errors: { message: string }[] | undefined): boolean {
  if (!errors?.length) return false
  return errors.some((e) => {
    const m = e.message
    return (
      /Unknown argument "(page|pageSize)"/.test(m) ||
      /Cannot query field "items"/.test(m) ||
      /Cannot query field "pageInfo"/.test(m)
    )
  })
}

export function legacySchemaHint(): string {
  return (
    'API service is on an older GraphQL schema (missing pagination). ' +
    'Railway ? api service ? Redeploy from latest main. ' +
    'Using embedded demo data until the api service is updated.'
  )
}
