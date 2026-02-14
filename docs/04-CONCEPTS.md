# CONCEPTS WE SHOULD NOT MISS

This short guide collects the most important ideas that students sometimes
skip on the first read. These concepts help us understand *why* the code looks
the way it does, not just *what* it does.

## Result and Error Flow

We use a `Result<T, E>` type instead of throwing errors for everyday control
flow. That means every operation returns either:

- `Ok(value)` for success, or
- `Err(error)` for failure.

This keeps errors visible in the type system and forces us to handle them at
each boundary. A typical path looks like this:

1) Repository returns `Result` (see `src/types/Result.ts`).
2) Service checks it and maps errors to service errors (see
   `src/availability/AvailabilityService.ts` and `src/event/EventService.ts`).
3) Port maps those errors to `PortError` (see
   `src/types/PortError.ts`, `src/event/EventPort.ts`,
   `src/availability/AvailabilityPort.ts`).
4) Router or controller returns a JSON response (see
   `src/web/routers/` and `src/web/controllers/`).

The flow is explicit, which makes the system easier to reason about.

## Time Is a Type (Not Just a String)

We do not store time as raw strings in the core domain. Instead, we validate
time strings and convert them into a `Time` object (see
`src/types/Time.ts`). This gives us a clean and consistent representation
(`{ hours, minutes }`) that is easy to check and format.

At the port boundary, we convert times back to strings so they can travel over
HTTP (see `src/availability/dto/AvailabilityOutputDto.ts`). This is a good
example of why DTOs exist: we keep internal types clean, and we keep external
types simple.

## In‑Memory Repositories Are Temporary

The repositories in this project store data in memory (see
`src/event/EventRepository.ts` and
`src/availability/AvailabilityRepository.ts`). That means data is lost when
the server restarts. We do this on purpose so we can focus on structure and
flow without adding database complexity.

In a production system, these repositories would be replaced by real storage.
The rest of the code would stay the same because repositories are behind
interfaces.

## asyncHandler and Express

Express does not automatically catch errors thrown inside `async` handlers. If
we do not wrap them, a rejected promise can crash the request and hide the
error. The `asyncHandler` helper keeps our routes safe by catching errors and
returning a 500 response consistently (see
`src/web/routers/EventRouter.ts` and
`src/web/routers/AvailabilityRouter.ts`).

## Polling Trade‑offs (UI Refresh)

We use `hx-trigger="every 5s"` to refresh events and availability. This is a
simple and readable way to keep the UI updated (see
`src/web/views/index.ejs` and
`src/web/views/partials/events-list.ejs`). The trade‑off is that it sends
requests even when nothing has changed. That is acceptable for a teaching app,
but in a larger system we might use server‑sent events or websockets instead.

## IDs in a Demo vs Production

We use simple random IDs in the demo (see `src/event/EventService.ts` and
`src/availability/AvailabilityRepository.ts`). This is fine for learning, but
in a real system we would use database IDs or UUIDs everywhere for consistency
and traceability.

## Testing Boundaries

A helpful testing strategy is:

- Unit tests for **services** (business logic).
- Integration tests for **routers + ports** (HTTP and data flow).
- Minimal tests for **repositories** if they are simple in‑memory stores.

This mirrors the architecture and keeps tests aligned with module boundaries.

## Why Dependency Injection in app.ts

`src/app.ts` wires everything together (see `src/app.ts`). This keeps
construction in one place and keeps modules focused on their own
responsibilities. It also makes it easy to swap implementations later (like
HTTP ports or database repositories).
