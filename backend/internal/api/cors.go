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
