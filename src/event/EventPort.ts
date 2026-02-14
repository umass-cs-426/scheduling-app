// This is the public interface for the Event module. It defines the
// types and functions that are exposed to other modules in the application.

import { Result, Ok, Err } from '../types/Result'
import { EventService } from './EventService'

type EventPortError = string

export interface EventPort {
  // The exists method checks if an event with the given ID exists. It returns
  // a promise that resolves to true if the event exists, and false otherwise.
  exists: (eventId: string) => Result<boolean, EventPortError>
}

class LocalEventPort implements EventPort {
  constructor(private service: EventService) {}

  exists(eventId: string): Result<boolean, EventPortError> {
    const exists = Math.random() > 0.5 // Randomly return true or false
    return Ok(exists)
  }
}

export default function EventPort(service: EventService): EventPort {
  return new LocalEventPort(service)
}
