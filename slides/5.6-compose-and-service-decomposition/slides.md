---
# try also 'default' to start simple
theme: default
background: https://cover.sli.dev
title: 5.6 Docker Compose and Service Decomposition
info: |
  ## 5.6 Docker Compose and Service Decomposition
  Orchestrating multi-container applications with Docker Compose, and how to break down a monolith into services.
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
duration: 75min
lineNumbers: true
highlighter: shiki
---

# 5.6 Docker Compose and Service Decomposition

<div class="text-2xl opacity-70 mt-6">
<p>https://github.com/umass-cs-426/scheduling-app</p>
<p>5.6-compose-and-service-decomposition</p>
</div>

---
class: text-2xl
---

# Schedule

- Homework 1 (to be released today)
- Exam 1 Thursday (study guide released today)
  - Focused subset of material
  - Slides and chosen aspects of the scheduling repository
  - 20 Multiple choice questions
  - 50 Minutes Max (expect ~25 min, but you have the entire time)
  - No surprises

---
class: text-2xl
---

# Material

- **Repository:** [https://github.com/umass-cs-426/scheduling-app](https://github.com/umass-cs-426/scheduling-app)
- **Branch:** 5.6-compose-and-service-decomposition

---
class: text-2xl
---

# Why Docker Compose Exists

Imagine our scheduling app has 3 containers:

- `web` for UI
- `api` for business logic
- `db` for PostgreSQL

Goal: start everything together, wire networking correctly, and repeat the same setup on every machine.

---
class: text-2xl
---

# Without Compose: Death by `docker run`

Using Docker alone, we must manually remember:

- container start order
- network creation and service hostnames
- environment variables and port mappings
- volume mounts and restart workflow

One typo or missed flag can break the whole stack.

---
class: text-2xl
---

# Now Scale That to 100 API Containers

What if we wanted to run 100 API services?

Imagine doing that with your home-cooked, terribly written shell script:

- duplicated command lines everywhere
- inconsistent env vars and port mappings
- brittle loops and race conditions
- painful debugging when only some containers fail

At that point, manual orchestration stops being practical.

---
layout: image
image: https://commons.wikimedia.org/wiki/Special:FilePath/Cygnus%20explosion.jpg
backgroundSize: cover
class: text-white
transition: fade
---

<div class="text-4xl font-bold leading-tight max-w-4xl mt-10">
"Sure, let's manually start 100 API containers. What could possibly go wrong?"
</div>

<div class="text-2xl opacity-85 mt-5">
- Every engineer, 30 seconds before chaos
</div>

---
layout: full
class: text-white
transition: fade
---

<div class="relative w-full h-full overflow-hidden">
  <div class="fixed inset-0 overflow-hidden">
    <video
      autoplay
      muted
      loop
      playsinline
      class="absolute top-1/2 left-1/2 min-w-full min-h-full max-w-none -translate-x-1/2 -translate-y-1/2"
      src="https://media.giphy.com/media/4K01QntGeIzXG/giphy.mp4"
    ></video>
    <div class="absolute inset-0 bg-black/35"></div>
  </div>
  <div class="relative z-10 h-full w-full flex items-center justify-center px-10">
    <div class="text-6xl font-extrabold leading-tight text-center drop-shadow-lg">
      This can't be good.
    </div>
  </div>
</div>

---
class: text-2xl code-lg
---

# The Compose Idea

Instead of many fragile commands, define the system once:

```yaml
services:
  web: { ... }
  api: { ... }
  db:  { ... }
```

Then run it with one command:

```bash
docker compose up
```

Compose is the single source of truth for your local multi-service environment.

---
layout: image
image: https://media.giphy.com/media/l0MYC0LajbaPoEADu/giphy.gif
backgroundSize: cover
class: text-white
transition: fade
---

<div class="w-full h-full flex items-center justify-center">
  <div class="text-6xl font-extrabold text-center drop-shadow-lg">
    Yes, this feels much better
  </div>
</div>

---
class: text-2xl
---

# Docker Compose

- A tool for defining and running multi-container Docker applications.
- Uses a YAML file to configure the application's services, networks, and volumes.
- Simplifies the process of managing multiple containers and their interactions.
- Allows you to start, stop, and manage all services with a single command.

YAML reference: [https://yaml.org/spec/1.2.2/](https://yaml.org/spec/1.2.2/)

---
class: text-2xl
---

# Service Decomposition

- The process of breaking down a monolithic application into smaller, independent services.
- Each service is responsible for a specific functionality and can be developed, deployed, and scaled independently.
- Benefits include improved maintainability, scalability, and flexibility.

Modular Monolith -> Service Decomposition -> Microservices

---
class: text-2xl
---

# Example: Scheduling App

- A scheduling application that allows users to create and manage events.
- Initially developed as a monolithic application.
- We will decompose it into services using Docker Compose.

- Services:
  - `web`: The frontend application.
  - `api`: The backend API that handles business logic and data storage.
  - `db`: The database service for storing event data.

---
class: text-2xl
---

# Approach

- First, we will use docker compose with our modular monolith
- Then, we will decompose the monolith into services and update our docker compose incrementally

---
class: text-2xl
---

# Docker Compose with Modular Monolith

- A `docker-compose.yml` file is created to define the services
- In this case, we will have a single service for the monolith, which includes both the frontend and backend components.

```yaml {1|1-2|1-3|4-5|6-7|8-9|1,3,4,6,8}
services:
  app:
    build: .
    ports:
      - '3000:3000'
    volumes:
      - .:/app
    environment:
      - NODE_ENV=development
```

<!-- TODO: Need to implement this file. -->


---
class: text-2xl
---

# Building the Application

- Before we run the system, we need to build it.
- We use the `docker compose build` command.
  - Reads the `docker-compose.yml` file
  - For each service, it builds the associated Docker image
  - Or it pulls an existing image from a registry (e.g., Docker Hub)

In our case, we will build the single image for the monolith.

```bash
docker compose build
```

<!-- TODO: record a cast of running this command -->

---
class: text-2xl
---

# Running the Application

After building the application, we can run it using the `docker compose up` command. This is similar to running `docker run` for a single container, but it will handle all the services defined in the `docker-compose.yml` file.

```bash
docker compose up
```

The application will be accessible at [http://localhost:3000](http://localhost:3000).

To bring the system down, type in `Ctrl-C` in the terminal.

<!-- TODO: record a cast of running this command -->

---
class: text-2xl
---

# Detached Mode

Detached mode allows you to run the application in the background, freeing up your terminal for other tasks. This is typically how we want to run our applications in production, and it can be useful during development as well.

```bash
docker compose up -d
```

Starts the containers in the background

---
class: framed-lists
---

# Fundamental Commands

There are many commands available in Docker Compose, but here are some of the most commonly used ones to get you started.

- `docker-compose up`: Starts containers defined in `docker-compose.yml`
- `docker-compose down`: Stops containers
- `docker-compose build`: Builds or rebuilds services
- `docker-compose logs`: View output from containers
- `docker-compose ps`: List containers
- `docker-compose exec`: Execute a command in a running container
- `docker-compose stop`: Stop services
- `docker-compose start`: Start existing containers for a service

---
class: text-2xl
zoom: 0.9
transition: fade
---

# Fundamental Commands Lifecycle

```mermaid
flowchart LR
  A[Compose file] --> B[docker compose up]
  B --> C[Running containers]
  C --> D[docker compose logs / ps / exec]
  C --> E[docker compose stop]
  E --> F[Stopped containers]
  F --> G[docker compose start]
  G --> C
  C --> H[docker compose down]
  H --> I[Removed containers + network]
```

---
class: text-2xl
zoom: 1.05
transition: fade
---

# Lifecycle Focus: Start and Observe

```mermaid
flowchart LR
  A[Compose file] --> B[docker compose up]
  B --> C[Running containers]
  C --> D[docker compose logs]
  C --> E[docker compose ps]
  C --> F[docker compose exec]
```

---
class: text-2xl
zoom: 1.05
transition: fade
---

# Lifecycle Focus: Pause, Resume, Remove

```mermaid
flowchart LR
  C[Running containers] --> E[docker compose stop]
  E --> F[Stopped containers]
  F --> G[docker compose start]
  G --> C
  C --> H[docker compose down]
  H --> I[Removed containers + network]
```

---
class: text-2xl
---

# Logs

Like with Docker, you can view the logs of your services using `docker-compose logs`. This will show you the combined logs of all services defined in your `docker-compose.yml` file. 

```bash
docker compose logs
```

You can also specify a particular service to view its logs: 
- `docker-compose logs <service-name>`.

---
class: text-2xl
---

# Listing Containers

To see a list of all running services defined in `docker-compose.yml`, you can use the `compose ps` sub-command.

```bash
docker compose ps
```

- Lists all composed services
- Shows their status and current state
- Useful for debugging


---
class: text-2xl
---

# Stopping Services

Sometimes you may want to stop the services without removing them, especially during development when you may want to pause the application to make changes or debug without losing the current state of the containers.

```bash
docker compose stop
```

This will stop/pause the running containers.

- Stopping services allows you to temporarily halt the application without losing any data or configuration.
- You can start the services again later without needing to rebuild or reconfigure them.
- This is useful during development when you may want to pause the application to make changes or debug without losing the current state of the containers.

---
class: text-2xl
---

# Starting Services

```bash
docker compose start
```

This starts containers that were previously created and stopped.

- `start` does not rebuild images
- `start` does not recreate containers
- Use it after `docker compose stop` when you want a fast resume

If your compose file changed (ports/env/services), use `docker compose up -d` instead.

---
class: text-2xl
---

# Restarting Services

Use `restart` when a service is running but needs a reset.

```bash
docker compose restart
```

- Restarts all services in the project
- Use `docker compose restart api` to target one service
- Faster than tearing down the whole stack

---
class: text-2xl
---

# Tearing Down the Stack

When you are done, remove the running stack cleanly:

```bash
docker compose down
```

- Stops containers
- Removes project network
- Keeps named volumes by default

Use `docker compose down -v` only when you want to delete persisted data.

---
class: text-2xl
---

# Executing Commands in a Running Service

`exec` lets you run a command inside a running container.

```bash
docker compose exec app sh
```

- Great for debugging environment/files
- Can run scripts directly (`npm test`, `ls`, etc.)
- Service must already be running

---
class: text-2xl
---

# One-Off Commands with `run`

Use `run` for temporary tasks that should not modify the main service lifecycle.

```bash
docker compose run --rm app npm run migrate
```

- Creates a new throwaway container
- Useful for migrations, seed scripts, ad-hoc jobs
- `--rm` removes the container after completion

---
class: text-2xl
---

# Following Logs Live

For active debugging, tail logs continuously:

```bash
docker compose logs -f app
```

- `-f` follows new log lines
- Omit service name to stream all services
- Add `--tail=100` to limit initial output

---
class: text-2xl
---

# Decomposition Goal

Next step: split our monolith into service boundaries.

- `web` serves UI
- `api` handles business logic
- `db` persists data

Compose gives us one place to define how these pieces run together.

<!-- TODO: Need to go through how we decompose the code. -->

---
class: text-2xl code-lg
---

# Add the Database Service

Start by extracting persistence to PostgreSQL:

```yaml
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: scheduling
      POSTGRES_USER: appuser
      POSTGRES_PASSWORD: devpass
    ports:
      - '5432:5432'
```

Now data storage is explicit and independently manageable.

---
class: text-2xl code-lg
zoom: 0.92
---

# Add the API Service

Move backend logic into its own container:

```yaml
services:
  api:
    build:
      context: .
      dockerfile: Dockerfile.api
    environment:
      DATABASE_URL: postgres://appuser:devpass@db:5432/scheduling
      NODE_ENV: development
    depends_on:
      - db
    ports:
      - '3001:3001'
```

API connects to Postgres at `db:5432` using Compose DNS.

---
class: text-2xl code-lg
---

# Add the Web Service

Front-end becomes a separate deployable unit:

```yaml
services:
  web:
    build:
      context: .
      dockerfile: Dockerfile.web
    environment:
      VITE_API_BASE_URL: http://api:3001
    depends_on:
      - api
    ports:
      - '3000:3000'
```

Now UI and API can evolve independently.

---
class: text-2xl
---

# Service Startup and Readiness

`depends_on` controls order, not readiness.

- API may start before DB is ready to accept connections
- Add retry logic in app startup
- Prefer health checks for better orchestration signals

Compose helps sequence services, but resilient apps handle transient failures.

---
class: text-2xl
zoom: 0.92
---

# Startup vs Readiness Sequence

```mermaid
sequenceDiagram
  participant C as Compose
  participant A as API
  participant D as DB
  C->>D: start db container
  C->>A: start api container (depends_on order)
  A->>D: connect attempt
  D-->>A: not ready yet
  A->>A: retry with backoff
  D-->>A: ready
  A->>D: connect succeeds
```

---
class: text-2xl code-lg
---

# Persist Database Data with Volumes

Named volumes keep data across container recreation:

```yaml
services:
  db:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

Without this, `docker compose down -v` and container replacement can wipe local state.

---
class: text-2xl
---

# Docker Volumes: Named Volumes

Named volumes are managed by Docker and are best for persistent app data.

```yaml
services:
  db:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

- Best for databases and durable service data
- Not tied to a specific host path
- Easy to reuse across container recreations

---
class: text-2xl
---

# Docker Volumes: Bind Mounts (Host Path)

Bind mounts map a host folder directly into a container path.

```yaml
services:
  api:
    build: .
    volumes:
      - ./src:/app/src
```

- Best for local development and live-edit workflows
- Changes on host appear immediately in container
- Less portable across machines than named volumes

---
layout: two-cols
layoutClass: cols-67-33
class: text-2xl
---

# Internal Networking and DNS

Compose creates a project network automatically.

- Each service name is a DNS hostname
- `api` can reach DB using `db:5432`
- `web` can reach API using `api:3001`

You usually do not need custom networks for simple projects.

::right::

```mermaid
flowchart LR
  subgraph N[compose default network]
    W[web service]
    A[api service]
    D[db service]
  end
  W -->|http://api:3001| A
  A -->|postgres://db:5432| D
```

---
class: text-2xl
---

# Scale Stateless Services

For stateless tiers (typically `web`), scale replicas:

```bash
docker compose up -d --scale web=3
```

- Useful for load tests and concurrency demos
- Avoid scaling stateful services (like DB) this way
- Add a reverse proxy when you need controlled traffic routing

[We will talk more about this at a later time.]{ .sentence-emphasis }

---
class: text-2xl framed-lists-amber
---

# ☑ Troubleshooting Checklist

When things fail, check in this order:

- `docker compose ps` for container state
- `docker compose logs -f <service>` for errors
- `docker compose config` for YAML/env issues
- Port collisions on host (`3000`, `3001`, `5432`)
- Bad connection strings or missing env vars

Most startup issues are config or networking mismatches.

---
class: text-2xl
---

# Reference Links

Official Docker docs used in this module:

- [Docker Compose guide](https://docs.docker.com/guides/docker-compose/)
- [Compose file reference](https://docs.docker.com/compose/compose-file/)
- [Compose volumes reference](https://docs.docker.com/reference/compose-file/volumes/)
- [`docker compose up` reference](https://docs.docker.com/reference/cli/docker/compose/up/)
- [`docker compose down` reference (`-v` / `--volumes`)](https://docs.docker.com/reference/cli/docker/compose/down/)
- [`docker compose logs` reference](https://docs.docker.com/reference/cli/docker/compose/logs/)
- [`docker compose exec` reference](https://docs.docker.com/compose/reference/exec)
- [Bind mounts](https://docs.docker.com/engine/storage/bind-mounts/)
- [Storage overview (volumes vs bind mounts)](https://docs.docker.com/engine/storage/)

---
class: text-2xl
---

# Activity: Debug Then Extend

You will work with a small Compose app that has 3 services:

- `web` (frontend)
- `api` (backend)
- `db` (postgres)

Part 1: find and fix a startup failure.

Part 2: add a 4th service and integrate it with minor changes.

---
class: text-2xl
---

# Activity Setup

Timebox:

- Part 1 (debug + fix): 15-20 min
- Part 2 (extend system): 20-25 min
- Debrief: 10 min

Rules:

- Use Compose commands first (`ps`, `logs`, `exec`, `config`)
- Keep changes minimal and focused
- Be ready to explain root cause and fix path

---
class: text-2xl code-lg
---

# Part 1: Broken System

Run this first:

```bash
docker compose up -d
docker compose ps
docker compose logs -f api
```

You should see a clear runtime error in API logs, but the root cause is not immediately obvious from the web UI.

---
class: text-2xl code-lg
---

# Part 1: Compose File (With Bug)

```yaml
services:
  web:
    build: ./web
    environment:
      API_BASE_URL: http://api:3001
    depends_on: [api]
    ports: ['3000:3000']

  api:
    build: ./api
    environment:
      DATABASE_URL: postgres://appuser:devpass@database:5432/appdb
    depends_on: [db]
    ports: ['3001:3001']

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: appdb
      POSTGRES_USER: appuser
      POSTGRES_PASSWORD: devpass
```

---
class: text-2xl
---

# Part 1: Investigation Checklist

Use this flow:

- Confirm service state: `docker compose ps`
- Find failing service logs: `docker compose logs api`
- Verify service names in compose vs connection strings
- Confirm network reachability from API container
- Apply minimal fix and re-run

Goal: explain why the error happens, not just what to change.

---
class: text-2xl framed-lists-green
---

# Part 1: Expected Fix

- Root cause: `DATABASE_URL` references host `database`
- Compose service name is `db`, so DNS lookup fails
- Error is obvious (`ENOTFOUND` or connection failure), source is subtle
- Fix: change connection string host from `database` -> `db`
- Validate with:
  - `docker compose up -d --build`
  - `docker compose ps`
  - `docker compose logs api`

---
class: text-2xl
---

# Part 2: Extend with New Service

Add a `notifier` service:

- Exposes `POST /notify`
- Logs the message payload
- Returns `{ ok: true }`

Integrate it so API sends a notify call when a new event is created.

Keep it simple: no queues, no auth, no persistence.

---
class: text-2xl code-lg
---

# Part 2: Minimal Integration Changes

Compose additions:

```yaml
services:
  notifier:
    build: ./notifier
    ports: ['3002:3002']

  api:
    environment:
      DATABASE_URL: postgres://appuser:devpass@db:5432/appdb
      NOTIFIER_URL: http://notifier:3002
    depends_on: [db, notifier]
```

API route sketch:

```js
await fetch(`${process.env.NOTIFIER_URL}/notify`, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ type: 'event.created', id: event.id }),
})
```

---
class: text-2xl framed-lists-blue
---

# Deliverables

- Short root-cause note for Part 1:
  - symptom
  - true cause
  - exact fix
- Working compose stack with new `notifier` service
- Evidence:
  - `docker compose ps` output
  - API logs showing successful DB connection
  - Notifier logs showing received event notifications

Stretch goal: update `web` to display a "notification sent" status.
