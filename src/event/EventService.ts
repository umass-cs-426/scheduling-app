import { Logger } from '../logging/Logging'
import { Err, Ok, Result } from '../types/Result'
import { Event } from './Event'
import { EventRepository } from './EventRepository'
import { CreateEventInputDto } from './dto/CreateEventInputDto'
import { CreateEventOutputDto } from './dto/CreateEventOutputDto'
import { ValidatedEventDto } from './dto/ValidatedEventDto'

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
  // Creates a new event using a DTO so we can track the "shape" of input data.
  createEvent(
    dto: CreateEventInputDto,
  ): Promise<Result<CreateEventOutputDto, EventServiceError>>
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
    dto: CreateEventInputDto,
  ): Promise<Result<CreateEventOutputDto, EventServiceError>> {
    // 1) Validate the raw input and convert it into a "trusted" DTO.
    const validated = this.validateInput(dto)
    if (!validated.ok) {
      return validated
    }

    // 2) Create the event from the validated data and save it.
    const id = Math.random().toString(36).substring(2, 9)
    const event = { id, title: validated.value.title, date: validated.value.date }
    const saveResult = await this.repository.save(event)
    if (!saveResult.ok) {
      return Err(CreateEventError(saveResult.error.message))
    }

    // 3) Return a DTO that defines our response shape.
    return Ok(CreateEventOutputDto(event))
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

  // Small validation helper that ensures we only store clean, trimmed strings.
  private validateInput(
    dto: CreateEventInputDto,
  ): Result<ValidatedEventDto, EventServiceError> {
    const title = dto.title?.trim()
    const date = dto.date?.trim()

    if (!title) {
      return Err(CreateEventError('title is required'))
    }

    if (!date) {
      return Err(CreateEventError('date is required'))
    }

    return Ok(ValidatedEventDto(title, date))
  }
}

export function EventService(
  logger: Logger,
  repository: EventRepository,
): EventService {
  return new BasicEventService(logger, repository)
}
