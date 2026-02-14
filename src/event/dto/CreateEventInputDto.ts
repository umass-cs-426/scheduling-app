// The CreateEventInputDto represents the raw input needed to create an event.
// We keep this separate so it's clear "what shape" the input has at the edge
// of the system (e.g., from a controller or router).
export interface CreateEventInputDto {
  title: string
  date: string
}

// Factory function to build a CreateEventInputDto in a consistent way.
export function CreateEventInputDto(
  title: string,
  date: string,
): CreateEventInputDto {
  return { title, date }
}
