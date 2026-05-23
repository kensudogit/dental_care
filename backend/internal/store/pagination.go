package store

func normalizePage(page, pageSize int) (int, int) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 10
	}
	if pageSize > 100 {
		pageSize = 100
	}
	return page, pageSize
}

func pageInfo(total, page, pageSize int) (int, int, int, int) {
	page, pageSize = normalizePage(page, pageSize)
	totalPages := 0
	if total > 0 {
		totalPages = (total + pageSize - 1) / pageSize
	}
	return total, page, pageSize, totalPages
}

func slicePage[T any](items []T, page, pageSize int) ([]T, int, int, int, int) {
	total, page, pageSize, totalPages := pageInfo(len(items), page, pageSize)
	if total == 0 {
		return []T{}, total, page, pageSize, totalPages
	}
	start := (page - 1) * pageSize
	if start >= total {
		return []T{}, total, page, pageSize, totalPages
	}
	end := start + pageSize
	if end > total {
		end = total
	}
	return items[start:end], total, page, pageSize, totalPages
}
