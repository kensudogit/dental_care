/**
 * Go API base URL (no trailing slash).
 * Local default: http://localhost:8080
 * Railway Web: set API_URL to the API service public HTTPS URL.
 */
export function resolveApiUrl(): string {
  const raw = process.env.API_URL?.trim()
  if (!raw) {
    return 'http://localhost:8080'
  }
  return raw.replace(/\/+$/, '')
}

export function isProductionDeploy(): boolean {
  return process.env.NODE_ENV === 'production'
}

export function graphQLConnectionHint(): string {
  if (isProductionDeploy()) {
    return (
      'Web service: set API_URL to the API public URL (https://..., no trailing slash). ' +
      'Confirm the API service is running and GET /health responds.'
    )
  }
  return (
    'Local: run npm run dev from the repository root (dental_care) so both api (:8080) ' +
    'and web (:3000) start. npm run dev inside frontend/ alone does not start the API.'
  )
}
