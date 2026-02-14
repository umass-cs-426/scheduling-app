import { Event } from '../Event'

// The CreateEventOutputDto represents the response shape after creating an event.
// This keeps output formatting explicit and consistent.
export interface CreateEventOutputDto {
  event: Event
}

export function CreateEventOutputDto(event: Event): CreateEventOutputDto {
  return { event }
}
