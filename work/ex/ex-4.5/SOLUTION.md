# Exercise 4.5 - Solution Reference

## Read This First (Honor System)

Do not read this file until you have attempted `work/ex/ex-4.5/README.md` on your own.

This course uses an honor system. We trust you to do the work first, then use this file to check understanding and fill gaps.

## Part A - Concept Warm-Up (Sample Strong Answers)

### 1) What is a container?

A container is a running process that includes everything the app needs from an image (filesystem, dependencies, config defaults), but still uses the host machine's kernel. It is isolated enough to be predictable, but lighter than a full virtual machine.

Why this is correct:

- "Running process" is key: a container is not just files; it is an executing instance.
- "From an image" explains where it comes from.
- "Uses host kernel" explains why containers are fast and lightweight relative to VMs.

### 2) What is an image?

An image is a read-only package blueprint that contains application code, runtime, dependencies, and metadata needed to start containers.

Why this is correct:

- "Read-only blueprint" distinguishes image from container.
- Images are reusable and shareable artifacts.
- One image can produce many containers.

### 3) Why are containers useful for scalable web systems?

Containers make deployment repeatable: the same image can run in development, CI, and production with fewer environment differences. They also make horizontal scaling easier because we can start many equivalent container instances from one image.

Why this is correct:

- Scalability depends on consistent, repeatable deployment.
- Containerized services are easier to replicate across machines.
- Fewer "works on my machine" issues reduces operational risk.

## Part B - Install and Verify Docker Desktop

### Expected command outcomes

```bash
docker --version
docker version
docker info
```

What success looks like:

- `docker --version`: prints Docker CLI version.
- `docker version`: shows both client and server/engine sections.
- `docker info`: prints engine/system information without daemon connection errors.

Why these checks matter:

- They verify both CLI availability and daemon availability.
- `docker version` and `docker info` confirm the engine is running, not just installed.

### Common error and meaning

Error:

```text
Cannot connect to the Docker daemon ...
```

Meaning:

- Docker Desktop is not running yet, or daemon startup is incomplete.
- On some systems, reboot/login after install may be required.

## Part C - Read the Repo Dockerfile (What each instruction means)

Open `Dockerfile` and map each line to purpose. A standard explanation is:

1. `FROM ...`
- Sets the base image (starting filesystem/runtime).

2. `WORKDIR ...`
- Sets default working directory for later instructions.

3. `COPY package*.json ...` then `RUN npm ci`
- Copies dependency manifests first, then installs exact dependencies.
- This pattern improves build caching: dependency layer is reused unless manifests change.

4. `COPY . .`
- Copies app source into the image.

5. `RUN npm run build`
- Compiles TypeScript into runnable JavaScript in `dist`.

6. `EXPOSE 3000`
- Documents intended container port (does not publish by itself).

7. `CMD ["npm","start"]`
- Defines default runtime command when container starts.

### Answers to Part C prompts

1) Why run `npm run build` inside the image?

Because the image should contain the exact compiled artifact it will run in production. Building inside the image ensures compile and runtime environments stay aligned and reproducible.

2) Why expose port `3000`?

The application listens on port 3000 by default. `EXPOSE 3000` communicates that intent, and runtime port publishing (`-p host:container`) maps host traffic to that container port.

3) Why run compiled JS (`dist`) instead of `ts-node` in production containers?

Compiled JS startup is typically simpler and more predictable in production. It avoids runtime TypeScript transpilation overhead and reduces moving parts during startup.

## Part D - Build and Run

### Build

```bash
docker build -t scheduler:ex-4.5 .
```

What this does:

- Uses current directory (`.`) as build context.
- Executes Dockerfile steps in order.
- Produces local image tag `scheduler:ex-4.5`.

### Run

```bash
docker run --name scheduler-ex-4.5 --env-file .env -p 3000:3000 scheduler:ex-4.5
```

What each flag does:

- `--name scheduler-ex-4.5`: stable container name for easier logs/inspect.
- `--env-file .env`: injects environment variables.
- `-p 3000:3000`: host port 3000 forwards to container port 3000.

### Expected checks

- `http://localhost:3000` loads app UI.
- `http://localhost:3000/health` returns:

```json
{"ok":true}
```

Why `/health` matters:

- It verifies process and HTTP route responsiveness with a minimal endpoint.
- It is a common production readiness/liveness pattern.

## Part E - Inspect and Troubleshoot Commands

### `docker ps`

Shows currently running containers with:

- container ID
- image
- command
- status
- ports
- name

Why it matters:

- First command to confirm whether container is actually running and mapped correctly.

### `docker logs scheduler-ex-4.5`

Shows stdout/stderr output from the app process.

Why it matters:

- Most startup failures (port in use, missing files, crash loops, runtime exceptions) appear here first.

### `docker inspect scheduler-ex-4.5 --format '{{.State.Status}}'`

Prints machine-readable runtime state (for example `running`, `exited`).

Why it matters:

- Helpful for scripts and quick state checks without scanning full JSON.

### Stop and remove

```bash
docker stop scheduler-ex-4.5
docker rm scheduler-ex-4.5
```

Why cleanup matters:

- Prevents container name collisions later.
- Keeps local environment tidy and reproducible for next attempts.

## Part F - Failure Drill (Reference Scenarios)

### Scenario 1: Port conflict

Symptom:

```text
Bind for 0.0.0.0:3000 failed: port is already allocated
```

Diagnosis:

- `docker ps` (another container already publishing 3000)
- `lsof -i :3000` (non-Docker process may be using it)

Fix:

- Stop conflicting process/container, or run with different host port:

```bash
docker run --name scheduler-ex-4.5 --env-file .env -p 3001:3000 scheduler:ex-4.5
```

Then visit `http://localhost:3001`.

### Scenario 2: Wrong image tag

Symptom:

```text
Unable to find image 'scheduler:wrong-tag' locally
```

Diagnosis:

- `docker image ls` to confirm available tags.

Fix:

- Use the correct tag or rebuild with desired tag.

### Scenario 3: App exits immediately

Symptom:

- Container appears then stops.

Diagnosis:

- `docker ps -a`
- `docker logs <container>`

Fix:

- Read error in logs, then correct config/code and rebuild image.

## Verify You Are Done (Expected State)

You should be able to say "yes" to all:

- Docker Desktop is installed and daemon is running.
- `docker version` and `docker info` complete successfully.
- Image build succeeds with `docker build -t scheduler:ex-4.5 .`.
- Container serves app via published port.
- You can inspect runtime with `docker ps`, `docker logs`, and `docker inspect`.
- You can clearly explain:
  - image vs container
  - what Dockerfile does
  - why container logs are a first-line debugging tool

## Short Self-Check Answers

1) Difference between image and container?
- Image is the packaged blueprint; container is the running instance.

2) What does a Dockerfile do?
- Defines repeatable steps to build an image.

3) What does `docker build -t scheduler:ex-4.5 .` produce?
- A locally tagged image built from the current folder context.

4) What does `docker run -p 3000:3000 scheduler:ex-4.5` do?
- Starts a container from that image and maps host port 3000 to container port 3000.

5) Two first debugging commands when page does not load?
- `docker ps` and `docker logs <container-name-or-id>`.
