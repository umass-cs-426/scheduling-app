// This is the public interface for the Event module. It defines the
// types and functions that are exposed to other modules in the application.

import { Result, Ok, Err } from '../types/Result'
import { EventService } from './EventService'
import { Event } from './Event'

type EventPortError = string

export interface EventPort {
  list: () => Promise<Result<Event[], EventPortError>>
  get: (eventId: string) => Promise<Result<Event, EventPortError>>
  exists: (eventId: string) => Promise<Result<boolean, EventPortError>>
  create: (
    title: string,
    date: string,
  ) => Promise<Result<Event, EventPortError>>
}

class LocalEventPort implements EventPort {
  constructor(private service: EventService) {}

  async list(): Promise<Result<Event[], EventPortError>> {
    const result = await this.service.listEvents()
    if (!result.ok) {
      return Err(`Failed to list events: ${result.error.message}`)
    }
    return Ok(result.value)
  }

  async get(eventId: string): Promise<Result<Event, EventPortError>> {
    const result = await this.service.getEvent(eventId)
    if (!result.ok) {
      return Err(`Failed to get event: ${result.error.message}`)
    }
    return Ok(result.value)
  }

  async exists(eventId: string): Promise<Result<boolean, EventPortError>> {
    const result = await this.service.exists(eventId)
    if (!result.ok) {
      return Err(`Failed to check event existence: ${result.error.message}`)
    }
    return Ok(result.value)
  }

  async create(
    title: string,
    date: string,
  ): Promise<Result<Event, EventPortError>> {
    const result = await this.service.createEvent(title, date)
    if (!result.ok) {
      return Err(`Failed to create event: ${result.error.message}`)
    }
    return Ok(result.value)
  }
}

export default function EventPort(service: EventService): EventPort {
  return new LocalEventPort(service)
}
