export function isUnsupportedSchemaError(errors: { message: string }[] | undefined): boolean {
  if (!errors?.length) return false
  return errors.some((e) => {
    const m = e.message
    return (
      /Unknown argument "(page|pageSize)"/.test(m) ||
      /Cannot query field "items"/.test(m) ||
      /Cannot query field "pageInfo"/.test(m) ||
      /Cannot query field "/.test(m) ||
      /Unknown argument "/.test(m)
    )
  })
}

/** @deprecated use isUnsupportedSchemaError */
export const isLegacySchemaError = isUnsupportedSchemaError

export function legacySchemaHint(): string {
  return (
    'API service is on an older GraphQL schema. ' +
    'Railway ? api service ? Redeploy from latest main. ' +
    'Using fallback data until the api service is updated.'
  )
}
