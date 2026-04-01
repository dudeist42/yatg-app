DEV_COMPOSE  = docker compose -f docker-compose.yml -f docker-compose.dev.yml --env-file .env.dev
PROD_COMPOSE = docker compose -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.prod

DEV_COMPOSE_ALL = ${DEV_COMPOSE} --profile all
PROD_COMPOSE_ALL = ${PROD_COMPOSE} --profile all

DEV_COMPOSE_BE = ${DEV_COMPOSE} --profile backend
PROD_COMPOSE_BE = ${PROD_COMPOSE} --profile backend

.PHONY: dev-up dev-down dev-logs dev-build dev-clean dev-up-be dev-down-be dev-logs-be dev-build-be dev-clean-be prod-up prod-down prod-logs prod-build prod-clean

# Dev
dev-up:
	$(DEV_COMPOSE_ALL) up -d

dev-down:
	$(DEV_COMPOSE_ALL) down

dev-clean:
	$(DEV_COMPOSE_ALL) down -v

dev-logs:
	$(DEV_COMPOSE_ALL) logs -f

dev-build:
	$(DEV_COMPOSE_ALL) up -d --build

# Dev Backend
dev-up-be:
	$(DEV_COMPOSE_BE) up -d

dev-down-be:
	$(DEV_COMPOSE_BE) down

dev-clean-be:
	$(DEV_COMPOSE_BE) down -v

dev-logs-be:
	$(DEV_COMPOSE_BE) logs -f

dev-build-be:
	$(DEV_COMPOSE_BE) up -d --build

# Prod
prod-up:
	$(PROD_COMPOSE_ALL) up -d

prod-down:
	$(PROD_COMPOSE_ALL) down

prod-clean:
	$(PROD_COMPOSE_ALL) down -v

prod-logs:
	$(PROD_COMPOSE_ALL) logs -f

prod-build:
	$(PROD_COMPOSE_ALL) up -d --build