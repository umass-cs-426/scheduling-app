# UI GUIDE

This document explains how our UI works and why we chose htmx and Alpine.js. Our
goal is to keep the interface simple, server‑driven, and easy to read. That is
why we use server‑side templates and small, focused JavaScript tools.

## What We Use and Why

### htmx (HTML‑First Interactions)

htmx lets us add dynamic behavior directly in HTML using attributes. Instead of
building a large client‑side app, we ask the server for small HTML fragments and
swap them into the page. This keeps the UI simple and keeps most logic on the
server, where we already have our data and validation.

In this repo, we use htmx for:

- Submitting forms without a full page refresh.
- Refreshing the events and availability lists.
- Deleting availability entries with a click and confirmation.
- Swapping small fragments instead of rebuilding the whole page.

This approach is much lighter than a full SPA framework and matches how the rest
of our modular monolith is organized.

### Alpine.js (Tiny, Local Interactions)

Alpine.js gives us small bits of interactivity when we need them. It is great
for “one‑component” behavior that would feel heavy in React or Vue. In this
project we use Alpine to keep the end time in sync when the start time changes.

The rule we follow is:

- Use **htmx** for server‑driven updates and HTML swaps.
- Use **Alpine** for small client‑side interactions.

That combination keeps our UI clear and easy to maintain.

## How the UI Works in This Project

Here is the basic flow:

1. The server renders the page using EJS templates.
2. htmx attributes tell the browser how to request updates.
3. The server returns small HTML fragments.
4. htmx swaps those fragments into the page.
5. Alpine handles tiny local updates (like “end time = start time + 1 hour”).

This keeps most UI logic on the server, which is easier to test and reason about
in a modular monolith.

## Why We Avoid Heavy SPA Frameworks Here

Frameworks like React and Vue are powerful, but they move a lot of logic to the
client. That can be great for complex client‑side apps, but it can also make
simple apps feel heavy. htmx + Alpine let us build interfaces that are fast to
iterate on, easy to read, and tightly connected to our server‑side domain logic.

## Evidence of Momentum (Current Links)

We are not claiming that any tool is the “one true future,” but these links show
that htmx and Alpine.js are actively maintained and widely used:

- htmx official site and docs:
  - [htmx.org](https://htmx.org/)
  - [htmx docs](https://htmx.org/docs/)

- Alpine.js official site:
  - [alpinejs.dev](https://alpinejs.dev/)

- Active, high‑adoption GitHub repos:
  - [bigskysoftware/htmx](https://github.com/bigskysoftware/htmx)
  - [alpinejs/alpine](https://github.com/alpinejs/alpine)

These sources show active development, documentation, and community usage, which
are good signals when choosing tools for a project.

## Where to Look in the Code

If we want to see these ideas in action, check:

- `src/web/views/index.ejs` for htmx and Alpine usage.
- `src/web/views/partials/` for HTML fragments returned by the server.
- `src/web/routers/` for endpoints that return fragments.

## UI Walkthrough (How the Pieces Fit Together)

This walkthrough is a guided tour of the UI code. We will move from the main
page to the fragments and then to the routes that power them.

### 1) The Main Page (index.ejs)

The main view is [`src/web/views/index.ejs`](../src/web/views/index.ejs). This
file renders the initial HTML and sets up all htmx and Alpine behavior.

Key ideas inside `index.ejs`:

- The **events form** posts to `/events/create` with htmx. The response is an
  HTML fragment that replaces the events list, so the page updates without a
  full reload.
- The **events list container** uses `hx-get="/events/fragment"` and
  `hx-trigger="every 5s"`, which means it refreshes itself on a timer.
- The **event select** is loaded from `/events/select` and can refresh when
  events change. This keeps the dropdown in sync with new events.
- The **availability form** posts to `/availability/create` with htmx and swaps
  the availability list when the server responds.
- The **availability list container** loads `/availability/fragment` and then
  refreshes on a timer, so new availability appears automatically.
- **Alpine.js** keeps `endTime` in sync with `startTime`, which is a tiny, local
  interaction that does not need a full UI framework.

This is a good example of “server‑first UI”: the server returns HTML, htmx swaps
it in, and Alpine handles only the smallest client‑side interaction.

### 2) HTML Fragments (partials/)

The UI updates are driven by small fragments in
[`src/web/views/partials`](../src/web/views/partials).

Important fragments:

- `events-list.ejs` renders the list of events in a readable HTML format.
- `event-select.ejs` renders the `<select>` dropdown of events.
- `events-fragment.ejs` returns the events list (used by the timed refresh).
- `availability-list.ejs` renders the grouped availability list and timeline.
- `availability-fragment.ejs` returns the availability list (used by refresh).

Each fragment is a normal EJS template. htmx makes a request, the server renders
the fragment, and htmx swaps the HTML into the page.

### 3) Routes That Power the Fragments

The fragment routes live in the routers:

- [`EventRouter.ts`](../src/web/routers/EventRouter.ts)
  - `GET /events/fragment` returns `events-fragment.ejs`
  - `GET /events/select` returns `event-select.ejs`
  - `POST /events/create` creates an event and then returns the updated list

- [`AvailabilityRouter.ts`](../src/web/routers/AvailabilityRouter.ts)
  - `GET /availability/fragment` returns `availability-fragment.ejs`
  - `POST /availability/create` creates availability and then returns the list
  - `DELETE /availability/delete/:id` removes availability and returns the list

These routes are intentionally thin. They validate input, call the port, and
render the correct fragment. The goal is to keep UI code simple and focused.

### 4) Static Assets and Styling

The styles live in [`src/web/static/styles.css`](../src/web/static/styles.css).
This file defines the overall look and feel, including the timeline visuals.

Express serves static files from `src/web/static`, which is configured in
[`SchedulingWebServer.ts`](../src/web/SchedulingWebServer.ts).

### 5) Putting It Together

When we load the page:

1. `index.ejs` renders the initial layout.
2. htmx automatically requests fragments for events and availability.
3. Those fragments replace the placeholder HTML.
4. Timed refreshes keep the lists up to date.
5. Alpine provides one small interaction (time syncing).

That is the entire UI. It is simple, server‑driven, and easy to extend.

## htmx Concepts We Use (Study Guide)

This section explains every htmx feature used in this codebase. Each item
includes a plain‑language description and where we use it.

### `hx-get`

**What it does:** Makes a GET request when a trigger fires and swaps the
response into the element.  
**Where we use it:** Timed refresh of events and availability lists.

### `hx-post`

**What it does:** Sends a POST request with the element’s form data.  
**Where we use it:** Event creation and availability submission forms.

### `hx-delete`

**What it does:** Sends a DELETE request.  
**Where we use it:** Clicking a timeline block or delete button to remove
availability.

### `hx-target`

**What it does:** Chooses which element should be replaced by the response.  
**Where we use it:** Swapping the events list and availability list containers.

### `hx-swap`

**What it does:** Controls _how_ content is replaced.  
**Common values in this project:**

- `outerHTML`: Replace the entire element (including its wrapper).
- `innerHTML`: Replace only the contents inside an element.

We use `outerHTML` for list fragments and `innerHTML` for the event select
wrapper so it keeps its own htmx attributes.

### `hx-trigger`

**What it does:** Controls _when_ the request is sent.  
**Patterns we use:**

- `load`: Request on page load.
- `every 5s`: Poll on a 5‑second interval.
- `events-updated from:body`: Listen for a custom event on the page.
- `click`: Fire when a user clicks.

### `hx-include`

**What it does:** Includes extra fields in the request, even if they are outside
the triggering element.  
**Where we use it:** When refreshing the event select, we include the current
`eventId` so the server can preserve the selection.

### `hx-confirm`

**What it does:** Shows a browser confirmation dialog before sending the
request.  
**Where we use it:** Deleting availability.

### `hx-on::after-request`

**What it does:** Runs JavaScript after htmx finishes a request.  
**Where we use it:** Resetting forms after a successful create.

### `hx-ext="json-enc"` and `hx-headers`

**What it does:** `json-enc` encodes form data as JSON, and `hx-headers` sets
the `Content-Type` header to `application/json`.  
**Where we use it:** Event and availability forms.

### `hx-swap-oob` (Out‑of‑Band swaps)

**What it does:** Allows a response to update parts of the page outside the
target element.  
**Note:** This appears in the event select partial but we do not currently
depend on it for updates. It is here to show the pattern for future use.

## Alpine.js Concepts We Use (Study Guide)

This section explains every Alpine feature used in this codebase.

### `x-data`

**What it does:** Declares a local state object and helper methods.  
**Where we use it:** The availability form, to hold `startTime`, `endTime`, and
a `syncEndTime()` helper.

### `x-model`

**What it does:** Two‑way binds an input to a piece of state.  
**Where we use it:** The start and end time inputs.

### `x-on:input.debounce.150`

**What it does:** Runs a method when the input changes, with a short debounce to
avoid firing on every keystroke.  
**Where we use it:** Update the end time whenever the start time changes.

### `x-bind:style`

**What it does:** Binds a style object to an element.  
**Where we use it:** Timeline blocks, to position them based on time.

### Why We Keep Alpine Small

We use Alpine for tiny, local interactions only. The rule is:

- Use htmx for server‑driven updates.
- Use Alpine for small client‑side convenience.

That balance keeps the UI simple and keeps most logic on the server.

## Summary

htmx and Alpine.js let us build modern, interactive UIs without a heavy
client‑side framework. This fits our goals and keeps the codebase simple. As we
move toward microservices, this style of UI will still work well because it
stays close to server‑side boundaries.
