.PHONY: help dev build preview clean test lint seed stop migrate-info

# Default target
help:
	@echo "Available commands:"
	@echo "  make dev          - Run Vite development server with Bun"
	@echo "  make stop         - Stop running dev server (kill ports 5173 & 5174)"
	@echo "  make build        - Typecheck and build for production"
	@echo "  make preview      - Preview production build"
	@echo "  make lint         - Run linter (oxlint)"
	@echo "  make clean        - Remove dist and node_modules/.tmp"
	@echo "  make seed         - Reset & reseed database from clean state"
	@echo "  make migrate-info - Show instructions for Supabase migration"

dev:
	bun dev --host

stop:
	@echo "Stopping dev servers on port 5173 & 5174..."
	@-sh -c 'fuser -k 5173/tcp 5174/tcp 2>/dev/null || true'
	@echo "Dev server stopped."

build:
	bun run build

preview:
	bun run preview

lint:
	bunx oxlint

clean:
	rm -rf dist node_modules/.tmp

seed:
	node scripts/seed.js

migrate-info:
	@echo "Open your Supabase SQL Editor: https://supabase.com/dashboard/project/mhdvguqxdfuberlpbxjz/sql"
	@echo "And execute the contents of supabase_schema.sql"
