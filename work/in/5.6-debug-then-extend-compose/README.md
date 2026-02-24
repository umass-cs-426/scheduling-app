# In-Class Activity 5.6 - Debug Then Extend (Compose)

This is the starter code for the activity shown in the 5.6 slides.

You will work with a small Docker Compose app with 3 services:

- `web` (frontend)
- `api` (backend)
- `db` (postgres)

Part 1:

- Start the stack
- Find and fix a startup failure in the API
- Explain the root cause clearly

Part 2:

- Add a 4th service (`notifier`)
- Update the API so creating an event sends a notification request

## Quick Start (Part 1)

From this folder:

```bash
docker compose up -d --build
docker compose ps
docker compose logs -f api
```

Open:

- http://localhost:3000

The web UI will show generic API failures. Use Compose logs and config details to find the real cause.

## Starter Files

- `compose.yaml`: starter compose config with an intentional bug
- `web/`: simple frontend service that proxies to the API
- `api/`: backend service with `GET /events` and `POST /events`
- `db/init.sql`: creates the `events` table
- `notifier/`: service code for Part 2 (not wired into compose yet)

## Part 2 TODOs

1. Add `notifier` to `compose.yaml`
2. Add `NOTIFIER_URL` to the `api` service environment
3. Update `api/server.js` in the `POST /events` route to call:

```js
await fetch(`${process.env.NOTIFIER_URL}/notify`, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ type: 'event.created', id: event.id }),
});
```

Keep the notifier call simple (log and continue on failure is acceptable for this activity).
