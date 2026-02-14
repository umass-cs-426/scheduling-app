// This is the public interface for the Event module. It defines the
// types and functions that are exposed to other modules in the application.

import { Result, Ok, Err } from '../types/Result'
import { EventService } from './EventService'
import { Event } from './Event'

type EventPortError = string

export interface EventPort {
  list: () => Result<Event[], EventPortError>
  get: (eventId: string) => Result<Event, EventPortError>
  exists: (eventId: string) => Result<boolean, EventPortError>
  create: (title: string, date: string) => Result<Event, EventPortError>
}

class LocalEventPort implements EventPort {
  constructor(private service: EventService) {}

  list(): Result<Event[], EventPortError> {
    const result = this.service.listEvents()
    if (!result.ok) {
      return Err(`Failed to list events: ${result.error.message}`)
    }
    return Ok(result.value)
  }

  get(eventId: string): Result<Event, EventPortError> {
    const result = this.service.getEvent(eventId)
    if (!result.ok) {
      return Err(`Failed to get event: ${result.error.message}`)
    }
    return Ok(result.value)
  }

  exists(eventId: string): Result<boolean, EventPortError> {
    const result = this.service.getEvent(eventId)
    return Ok(!result.ok ? false : true)
  }

  create(title: string, date: string): Result<Event, EventPortError> {
    const result = this.service.createEvent(title, date)
    if (!result.ok) {
      return Err(`Failed to create event: ${result.error.message}`)
    }
    return Ok(result.value)
  }
}

export default function EventPort(service: EventService): EventPort {
  return new LocalEventPort(service)
}
