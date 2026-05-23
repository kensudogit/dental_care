# Regenerate linux/amd64 Go binary for frontend/Dockerfile (Railway).
# Run from repo root after backend changes:
#   powershell -File scripts/build-linux-server.ps1

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$out = Join-Path $root "frontend\bin\dental-care-server"
Push-Location (Join-Path $root "backend")
$env:GOOS = "linux"
$env:GOARCH = "amd64"
$env:CGO_ENABLED = "0"
go build -o $out ./cmd/server
Pop-Location
Write-Host "Built $out"
