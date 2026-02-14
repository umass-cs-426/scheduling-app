// This is the public interface for the Event module. It defines the
// types and functions that are exposed to other modules in the application.

import { Result, Ok, Err } from '../types/Result'
import { EventService } from './EventService'
import { Event } from './Event'
import { Logger } from '../logging/Logging'
import EventRepository from './EventRepository'
import { CreateEventInputDto } from './dto/CreateEventInputDto'
import { CreateEventOutputDto } from './dto/CreateEventOutputDto'
import { PortError } from '../types/PortError'

export interface EventPort {
  list: () => Promise<Result<Event[], PortError>>
  get: (eventId: string) => Promise<Result<Event, PortError>>
  exists: (eventId: string) => Promise<Result<boolean, PortError>>
  create: (
    dto: CreateEventInputDto,
  ) => Promise<Result<CreateEventOutputDto, PortError>>
}

class LocalEventPort implements EventPort {
  constructor(private service: EventService) {}

  async list(): Promise<Result<Event[], PortError>> {
    const result = await this.service.listEvents()
    if (!result.ok) {
      return Err(
        PortError('Failed to list events', { cause: result.error }),
      )
    }
    return Ok(result.value)
  }

  async get(eventId: string): Promise<Result<Event, PortError>> {
    const result = await this.service.getEvent(eventId)
    if (!result.ok) {
      return Err(
        PortError('Failed to get event', { cause: result.error }),
      )
    }
    return Ok(result.value)
  }

  async exists(eventId: string): Promise<Result<boolean, PortError>> {
    const result = await this.service.exists(eventId)
    if (!result.ok) {
      return Err(
        PortError('Failed to check event existence', {
          cause: result.error,
        }),
      )
    }
    return Ok(result.value)
  }

  async create(
    dto: CreateEventInputDto,
  ): Promise<Result<CreateEventOutputDto, PortError>> {
    // Pass the DTO into the service, which validates and saves.
    const result = await this.service.createEvent(dto)
    if (!result.ok) {
      return Err(
        PortError('Failed to create event', { cause: result.error }),
      )
    }
    // 3) Return the output DTO, which defines our response shape.
    return Ok(result.value)
  }
}

export function EventPort(logger: Logger): EventPort {
  const repository = EventRepository(logger)
  const service = EventService(logger, repository)
  return new LocalEventPort(service)
}
