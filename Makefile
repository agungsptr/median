TAG := $(shell git tag --sort=creatordate | tail -1)
IMAGE := agungsptr/median
COMPOSE := docker-compose -f docker-compose.yml


# Infrastructure
build:
	@yarn tsc
	docker build -t $(IMAGE):$(TAG) .

compose-up:
	@echo "Starting services..."
	@TAG=$(TAG) $(COMPOSE) down -v || true
	@TAG=$(TAG) $(COMPOSE) up -d --force-recreate

compose-down:
	@TAG=$(TAG) $(COMPOSE) down -v || true

purge:
	@make -s compose-down
	@docker image rm $(IMAGE):$(TAG) || true

infra:
	@echo "Starting DB service..."
	@TAG=$(TAG) $(COMPOSE) down -v || true
	@TAG=$(TAG) $(COMPOSE) up -d --force-recreate db-postgres
	@sleep 1
	@make -s wait-db

wait-db:
	@echo "Checking database is ready..."
	@scripts/wait-for-it.sh 0.0.0.0:$(PG_PORT)
	@echo "Database is ready"

wait-app:
	@echo "Checking app  ready..."
	@scripts/wait-for-it.sh 0.0.0.0:$(APP_PORT) 
	@echo "App is ready"

.PHONY: build test
