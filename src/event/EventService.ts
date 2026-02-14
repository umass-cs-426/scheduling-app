import { Logger } from '../logging/Logging'
import { Err, Ok, Result } from '../types/Result'
import { Event } from './Event'
import { EventRepository } from './EventRepository'

export type BaseEventServiceError = { message: string }
export type CreateEventError = BaseEventServiceError & {
  kind: 'CreateEventError'
}
export type ListEventsError = BaseEventServiceError & {
  kind: 'ListEventsError'
}
export type ExistsEventError = BaseEventServiceError & {
  kind: 'ExistsEventError'
}

export type EventServiceError =
  | CreateEventError
  | ListEventsError
  | ExistsEventError

function CreateEventError(message: string): CreateEventError {
  return { kind: 'CreateEventError', message }
}

function ListEventsError(message: string): ListEventsError {
  return { kind: 'ListEventsError', message }
}

function ExistsEventError(message: string): ExistsEventError {
  return { kind: 'ExistsEventError', message }
}

export interface EventService {
  // Creates a new event with the given title and date
  createEvent(
    title: string,
    date: string,
  ): Promise<Result<Event, EventServiceError>>
  // Get an event by ID
  getEvent(eventId: string): Promise<Result<Event, EventServiceError>>
  // Lists all events
  listEvents(): Promise<Result<Event[], EventServiceError>>
  // Checks if an event with the given ID exists
  exists(eventId: string): Promise<Result<boolean, EventServiceError>>
}

class BasicEventService implements EventService {
  constructor(
    private logger: Logger,
    private repository: EventRepository,
  ) {}

  async getEvent(eventId: string): Promise<Result<Event, EventServiceError>> {
    const result = await this.repository.find(eventId)
    if (result.ok) {
      return result
    } else {
      return Err(CreateEventError(result.error.message))
    }
  }

  async createEvent(
    title: string,
    date: string,
  ): Promise<Result<Event, EventServiceError>> {
    const id = Math.random().toString(36).substring(2, 9)
    const event = { id, title, date }
    const saveResult = await this.repository.save(event)
    if (!saveResult.ok) {
      return Err(CreateEventError(saveResult.error.message))
    }
    return Ok(event)
  }

  async listEvents(): Promise<Result<Event[], EventServiceError>> {
    const result = await this.repository.findAll()
    if (result.ok) {
      return result
    } else {
      return Err(ListEventsError(result.error.message))
    }
  }

  async exists(eventId: string): Promise<Result<boolean, EventServiceError>> {
    const result = await this.repository.exists(eventId)
    if (result.ok) {
      return result
    } else {
      return Err(ExistsEventError(result.error.message))
    }
  }
}

export function EventService(
  logger: Logger,
  repository: EventRepository,
): EventService {
  return new BasicEventService(logger, repository)
}
