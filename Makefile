SHELL := /bin/bash
COMPOSE := docker compose -f docker_compose.yaml

.PHONY: up down \
	api web mobile \
	api-stack-up api-stack-down \
	lint lint-api lint-web lint-mobile lint-tests-web \
	test test-api test-web test-mobile

# Full stack (Postgres, API, web) — same as before
up:
	$(COMPOSE) up --build

down:
	$(COMPOSE) down

# Local dev (foreground) — matches README “Run API / Web / Mobile”
api:
	cd api && dotnet run

web:
	cd web && pnpm dev

mobile:
	cd mobile && pnpm start

# API + Postgres in Docker for testing web/mobile against http://localhost:8080
# Sources .env when present so OPENAI_API_KEY and other vars apply to Compose interpolation & containers.
api-stack-up:
	@set -a && [[ -f .env ]] && . ./.env || true; set +a && \
	$(COMPOSE) up -d --build db api

api-stack-down:
	@set -a && [[ -f .env ]] && . ./.env || true; set +a && \
	$(COMPOSE) stop db api

lint: lint-api lint-web lint-mobile lint-tests-web

lint-api:
	dotnet build eRep.sln -v q

lint-web:
	cd web && pnpm lint

lint-mobile:
	cd mobile && pnpm lint

lint-tests-web:
	cd tests/web && pnpm lint

test: test-api test-web test-mobile

test-api:
	dotnet test tests/api/api.Tests.csproj --verbosity minimal

test-web:
	cd tests/web && pnpm test

test-mobile:
	cd mobile && pnpm test
