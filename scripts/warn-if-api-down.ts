const base = (process.env.API_URL ?? 'http://localhost:8080').replace(/\/+$/, '')

try {
  const res = await fetch(`${base}/health`, { signal: AbortSignal.timeout(2500) })
  if (res.ok) process.exit(0)
} catch {
  // API not running
}

console.warn('')
console.warn('[dental-care] Go API is not running at', base)
console.warn('  From repository root run:  npm run dev')
console.warn('  (starts API :8080 and Next :3000 together)')
console.warn('')
