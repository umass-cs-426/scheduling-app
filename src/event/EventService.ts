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
  createEvent(title: string, date: string): Result<Event, EventServiceError>
  // Get an event by ID
  getEvent(eventId: string): Result<Event, EventServiceError>
  // Lists all events
  listEvents(): Result<Event[], EventServiceError>
  // Checks if an event with the given ID exists
  exists(eventId: string): Result<boolean, EventServiceError>
}

class BasicEventService implements EventService {
  constructor(
    private logger: Logger,
    private repository: EventRepository,
  ) {}

  getEvent(eventId: string): Result<Event, EventServiceError> {
    const result = this.repository.find(eventId)
    if (result.ok) {
      return result
    } else {
      return Err(CreateEventError(result.error.message))
    }
  }

  createEvent(title: string, date: string): Result<Event, EventServiceError> {
    const id = Math.random().toString(36).substring(2, 9)
    const event = { id, title, date }
    const saveResult = this.repository.save(event)
    if (!saveResult.ok) {
      return Err(CreateEventError(saveResult.error.message))
    }
    return Ok(event)
  }

  listEvents(): Result<Event[], EventServiceError> {
    const result = this.repository.findAll()
    if (result.ok) {
      return result
    } else {
      return Err(ListEventsError(result.error.message))
    }
  }

  exists(eventId: string): Result<boolean, EventServiceError> {
    const result = this.repository.exists(eventId)
    if (result.ok) {
      return result
    } else {
      return Err(ExistsEventError(result.error.message))
    }
  }
}

export default function EventService(
  logger: Logger,
  repository: EventRepository,
): EventService {
  return new BasicEventService(logger, repository)
}
