package api

import (
	"os"
	"strings"
)

func corsOrigins() []string {
	defaults := []string{
		"http://localhost:3000",
		"http://127.0.0.1:3000",
	}
	if raw := strings.TrimSpace(os.Getenv("ALLOWED_ORIGINS")); raw != "" {
		parts := strings.Split(raw, ",")
		out := make([]string, 0, len(parts)+len(defaults))
		for _, p := range parts {
			p = strings.TrimSpace(p)
			if p != "" {
				out = append(out, p)
			}
		}
		return append(out, defaults...)
	}
	return defaults
}

// railwayOriginAllowed permits *.up.railway.app when ALLOWED_ORIGINS is unset.
func railwayOriginAllowed(origin string) bool {
	origin = strings.TrimSpace(origin)
	if origin == "" {
		return true
	}
	for _, allowed := range corsOrigins() {
		if allowed == "*" || strings.EqualFold(allowed, origin) {
			return true
		}
	}
	if strings.TrimSpace(os.Getenv("ALLOWED_ORIGINS")) == "" {
		lower := strings.ToLower(origin)
		if strings.HasSuffix(lower, ".up.railway.app") {
			return true
		}
	}
	return false
}
