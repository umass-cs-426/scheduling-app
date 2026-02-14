# ARCHITECTURE NOTES

## Future: HTTP Ports for Microservices

We plan to add `HttpEventPort` and `HttpAvailabilityPort` later so the
application can swap in network calls when Event and Availability become
separate services.

Goals for those HTTP ports:
- Implement the same interfaces as the in-process ports.
- Serialize input DTOs and parse output DTOs.
- Convert HTTP failures into `PortError` with status/code/message.

This note is here as a reminder for the next phase.
