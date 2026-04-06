.PHONY: up down lint lint-api lint-web lint-mobile lint-tests-web test test-api test-web test-mobile

up:
	docker compose -f docker_compose.yaml up --build

down:
	docker compose -f docker_compose.yaml down

lint: lint-api lint-web lint-mobile lint-tests-web

lint-api:
	dotnet build EchoRep.sln -v q

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
