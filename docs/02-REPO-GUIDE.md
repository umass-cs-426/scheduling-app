# REPO GUIDE

This repository is a teaching project that shows how to build a modular
monolith. A modular monolith is a single application process that is divided
into clear, well-defined modules. Each module owns its data and logic, and the
modules talk to each other through explicit boundaries. This gives you the
clarity of separate services while keeping the simplicity of a single codebase
and deployment.

The goal is to make the structure easy to understand today, and also to
foreshadow how the same modules could later move into separate processes when
we introduce microservices. You will see this most clearly in the “Port”
interfaces, which act like gates between modules. Those gates are the future
seams where network calls could be introduced without changing the rest of the
system.

## Big Picture: How the App Is Organized

There are two main domain modules: **Event** and **Availability**. Each module
has its own data types, service logic, and repository. The web layer (Express)
is intentionally thin and just connects HTTP requests to the module ports. This
keeps the web layer simple and lets the modules stay focused on business logic.

At a high level, a request flows like this:

1) An HTTP request hits an Express route.
2) The route builds an input DTO and calls a Port.
3) The Port calls the Service for the module.
4) The Service validates, applies logic, and saves via the Repository.
5) The result flows back out as an output DTO.

The key idea is that the **Port boundary** is where the module exposes its
public API. Everything inside a module can change without forcing the rest of
the app to change, as long as the Port interface stays the same.

## How the Data Flows (End to End)

When we trace a single request through the system, we can see the boundaries
very clearly:

1) A browser sends an HTTP request.
2) A route (or controller) parses input and builds a DTO.
3) A Port receives the DTO and calls the Service.
4) The Service validates, applies logic, and uses the Repository.
5) The Repository reads or writes data.
6) The Service returns a DTO to the Port.
7) The Port returns a DTO to the web layer.
8) The web layer returns JSON or HTML back to the browser.

This flow is intentionally consistent across modules. That consistency is what
makes the codebase easier to learn and easier to evolve.

## The Event Module

The Event module owns event data (title, date, id). It is structured like this:

- [`Event.ts`](../src/event/Event.ts) defines the core Event type.
- [`dto/`](../src/event/dto) defines explicit input and output shapes.
- [`EventService.ts`](../src/event/EventService.ts) contains the business
  logic for creating, listing, and
  checking events.
- [`EventRepository.ts`](../src/event/EventRepository.ts) stores events
  (currently in memory).
- [`EventPort.ts`](../src/event/EventPort.ts) exposes the Event module to
  the rest of the application.

### Why DTOs?

DTOs (Data Transfer Objects) make it clear what shape of data is allowed to
enter or leave a module. That clarity helps us see where validation happens
and makes it easier to evolve the code over time. It also makes future network
calls straightforward, because DTOs are already in a format we can serialize
to JSON.

In industry, DTOs are used to make boundaries explicit. A DTO is not just “the
data,” it is the *container* that tells us where that data came from and what
we are allowed to assume about it. Two objects can have the same fields and
values, but if one is a raw input DTO and the other is a validated DTO, they
mean different things. The container signals intent and trust level.

For example, a `CreateEventInputDto` represents data that just entered the
system. We should assume it is untrusted and validate it. After validation, we
convert it into a `ValidatedEventDto`. That validated DTO may have the same
title and date values, but its *type* tells us that we already checked those
values and can safely store them. This is why DTOs scale well in larger code
bases: they reduce ambiguity, improve readability, and help us avoid using
unvalidated data in trusted parts of the system.

## The Availability Module

Availability depends on Event because an availability must belong to an event.
This module follows the same pattern as Event:

- [`Availability.ts`](../src/availability/Availability.ts) defines the core
  Availability type.
- [`dto/`](../src/availability/dto) defines input and output shapes, including
  time formatting.
- [`AvailabilityService.ts`](../src/availability/AvailabilityService.ts)
  validates and stores availability.
- [`AvailabilityRepository.ts`](../src/availability/AvailabilityRepository.ts)
  persists availability (in memory).
- [`AvailabilityPort.ts`](../src/availability/AvailabilityPort.ts) exposes the
  module boundary.

The service uses the Event port to check that an event exists. This is a good
example of how modules talk to each other through explicit boundaries rather
than reaching into each other’s internal code.

## The Web Layer

The web layer lives in `src/web`. It contains:

- [`SchedulingWebServer.ts`](../src/web/SchedulingWebServer.ts) which
  configures Express and the view engine.
- [`routers/`](../src/web/routers) which define HTTP routes.
- [`controllers/`](../src/web/controllers) (used for some routes) that
  translate HTTP requests into port calls.
- [`views/`](../src/web/views) (EJS templates) and
  [`static/`](../src/web/static) assets for the demo UI.

The routers build input DTOs and call ports, then return output DTOs as JSON or
render HTML fragments for htmx updates. This keeps the web layer readable and
thin: it mostly coordinates requests and responses, while the domain logic
lives in the modules.

## The Port Boundary (The Future Seam)

Ports are the most important idea in this repository. A Port is an interface
that defines what a module can do, without exposing how it does it. Right now,
the Port implementations are “local”: they call the module services directly.

Later, when we introduce microservices, we can create “HTTP ports” that make
network requests instead. The rest of the system would not need to change,
because it already depends on the Port interface rather than the internal
service or repository.

This is why ports return DTOs and `PortError` objects. That structure makes it
clear how data and errors should flow, even when the module is in another
process.

## Logging

Logging is centralized through the logging module
([`Logging.ts`](../src/logging/Logging.ts)). Keeping logging as a module helps
standardize the output and reduces cross‑cutting noise in the domain modules.
When we move to multiple processes later, the same logging patterns can be
applied without rewriting the domain logic.

## How to Read the Code

Start with the Event module and follow the flow:

1) [`EventPort`](../src/event/EventPort.ts) (public API)
2) [`EventService`](../src/event/EventService.ts) (business logic)
3) [`EventRepository`](../src/event/EventRepository.ts) (storage)
4) [`dto/`](../src/event/dto) (input/output shapes)

Then compare to Availability and notice the similarities. The consistency is
intentional: it makes the system easier to learn and easier to scale.

Finally, look at the web layer to see how a request is translated into a port
call. The web layer is intentionally straightforward so it is easy to replace
or extend later.

## Summary

This codebase is a modular monolith by design. It teaches clear boundaries,
explicit data shapes, and separation of concerns. Those same qualities make it
an ideal stepping‑stone to microservices, because the “edges” are already
defined. When we eventually split the modules into separate services, the Port
interfaces and DTOs will allow that change to happen with minimal disruption.
