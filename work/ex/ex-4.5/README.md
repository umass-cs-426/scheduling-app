# Exercise 4.5 - Docker and the Monolith

Exercises are guided practice for lecture material. This exercise is not graded, but future assignments assume you completed it.

Estimated time: 60-90 minutes

## Why This Exercise Matters

In scalable systems, we need repeatable environments across laptops, CI pipelines, and servers. Docker helps us package an application and run it consistently as a container.

By the end of this exercise, you should be able to:

- Explain image vs container in your own words.
- Install and verify Docker Desktop.
- Read a Dockerfile at a high level.
- Build and run this monolith with Docker.
- Inspect container state with core CLI commands.
- Diagnose common container startup issues.

## Prerequisites

- VS Code
- Git
- Node.js and npm (already used in prior exercises)
- This repository checked out locally

## Starting Setup

1. Open this repository in VS Code.
2. Open the built-in terminal (`Terminal -> New Terminal`).
3. Ensure you are in the repo root (same directory as `package.json`).

## Part A - Concept Warm-Up (5-10 min)

Write short notes (2-3 sentences each):

1. What is a container?
2. What is an image?
3. Why are containers useful for scalable web systems?

Use these working definitions:

- `Image`: a packaged, read-only blueprint (app + dependencies + config).
- `Container`: a running instance of an image.
- `Dockerfile`: the build recipe used to create an image.

## Part B - Install Docker Desktop (15-30 min)

Install Docker Desktop for your OS:

- https://www.docker.com/products/docker-desktop/

After installation:

1. Launch Docker Desktop.
2. Wait until it reports Docker is running.
3. In VS Code terminal, run:

```bash
docker --version
docker version
docker info
```

Expected:

- `docker --version` prints a version.
- `docker version` shows both client and server sections.
- `docker info` returns successfully (long output is normal).

If you get "Cannot connect to the Docker daemon", Docker Desktop is not fully running yet.

## Part C - Read the Repo Dockerfile (10 min)

Open `Dockerfile` in this repo and annotate each instruction in plain English:

1. Base image
2. Working directory
3. Dependency install
4. Source copy
5. Build step
6. Runtime command

Then answer:

1. Why do we run `npm run build` inside the image?
2. Why do we expose port `3000`?
3. What is one benefit of running compiled JS (`dist`) instead of `ts-node` in production containers?

## Part D - Build and Run the Container (15-20 min)

From the repo root:

```bash
docker build -t scheduler:ex-4.5 .
```

Run it:

```bash
docker run --name scheduler-ex-4.5 --env-file .env -p 3000:3000 scheduler:ex-4.5
```

Open:

- http://localhost:3000
- http://localhost:3000/health

Expected:

- UI loads on `/`
- `{"ok":true}` on `/health`

## Part E - Inspect and Troubleshoot (15 min)

Keep the container running and open a second terminal.

Run:

```bash
docker ps
docker logs scheduler-ex-4.5
docker inspect scheduler-ex-4.5 --format '{{.State.Status}}'
```

Now stop and clean up:

```bash
docker stop scheduler-ex-4.5
docker rm scheduler-ex-4.5
```

Optional cleanup:

```bash
docker image ls | head
```

## Part F - Quick Failure Drill (10 min)

Try one of these and recover:

1. Start container with a conflicting port (if 3000 is already in use).
2. Start without `--env-file .env`.
3. Use the wrong image tag.

For the issue you chose, write:

- The exact error message
- Which command diagnosed it
- What fixed it

## Verify You Are Done

You are done when all are true:

- Docker Desktop is installed and running.
- `docker version` and `docker info` work.
- `docker build -t scheduler:ex-4.5 .` succeeds.
- Container serves app on `http://localhost:3000`.
- `/health` returns `{"ok":true}`.
- You used `docker ps` and `docker logs` to inspect runtime behavior.
- You can explain image vs container without notes.

## What to Keep

No submission required. Keep your notes for later assignments and exams.

At minimum, keep:

- Your concept notes from Part A
- Dockerfile annotations from Part C
- Failure drill notes from Part F

## If You Get Stuck

1. Copy the exact command and error message.
2. Check Docker Desktop status.
3. Run `docker ps -a` and `docker logs <container-name>`.
4. Ask for help in the course technical support channel with:
   - command run
   - full error text
   - what you already tried

## Solution Reference (After You Attempt the Exercise)

Honor system: attempt all parts first, then use the solution to check and improve your understanding.

- [`SOLUTION.md`](SOLUTION.md)
