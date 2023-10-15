# Description: Makefile for the project

ifneq ($(shell docker compose 2> /dev/null),)
DOCKER_COMPOSE := docker compose
else ifneq ($(shell docker-compose 2> /dev/null),)
DOCKER_COMPOSE := docker-compose
else 
$(error "docker-compose is not installed")
endif

# Define the default target
.DEFAULT_GOAL := up


# up
up:
	@echo "Starting the containers..."
	$(DOCKER_COMPOSE) -f docker/docker-compose.local.yml up -d

# down
down:
	@echo "Stopping the containers..."
	$(DOCKER_COMPOSE) -f docker/docker-compose.local.yml down