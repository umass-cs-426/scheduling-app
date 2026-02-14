import { Logger } from '../logging/Logging'
import { Result, Ok, Err } from '../types/Result'
import { Event } from './Event'

type BaseRepoError = { message: string }
type SaveRepoError = BaseRepoError & { kind: 'SaveRepoError' }
type FindAllRepoError = BaseRepoError & { kind: 'FindAllRepoError' }

export type RepositoryError = SaveRepoError | FindAllRepoError

function SaveRepoError(message: string): SaveRepoError {
  return { kind: 'SaveRepoError', message }
}

function FindAllRepoError(message: string): FindAllRepoError {
  return { kind: 'FindAllRepoError', message }
}

export interface EventRepository {
  save(event: Event): Promise<Result<Event, RepositoryError>>
  find(eventId: string): Promise<Result<Event, RepositoryError>>
  findAll(): Promise<Result<Event[], RepositoryError>>
  exists(eventId: string): Promise<Result<boolean, RepositoryError>>
}

class InMemoryEventRepository implements EventRepository {
  private storage: Map<string, Event> = new Map()

  constructor(private logger: Logger) {
    logger.info('InMemoryEventRepository initialized')
  }

  async find(eventId: string): Promise<Result<Event, RepositoryError>> {
    try {
      this.logger.info(`Finding event ID: ${eventId}`)
      const event = this.storage.get(eventId)
      if (!event) {
        return Err(FindAllRepoError(`Event with ID ${eventId} not found`))
      }
      return Ok(event)
    } catch (error) {
      this.logger.error(`Failed to find event: ${error}`)
      return Err(FindAllRepoError('Failed to find event'))
    }
  }

  async save(event: Event): Promise<Result<Event, RepositoryError>> {
    try {
      this.logger.info(`Saving event: ${JSON.stringify(event)}`)
      this.storage.set(event.id, event)
      return Ok(event)
    } catch (error) {
      this.logger.error(`Failed to save event: ${error}`)
      return Err(SaveRepoError('Failed to save event'))
    }
  }

  async findAll(): Promise<Result<Event[], RepositoryError>> {
    try {
      this.logger.info('Retrieving all events')
      return Ok(Array.from(this.storage.values()))
    } catch (error) {
      this.logger.error(`Failed to retrieve events: ${error}`)
      return Err(FindAllRepoError('Failed to retrieve events'))
    }
  }

  async exists(eventId: string): Promise<Result<boolean, RepositoryError>> {
    try {
      this.logger.info(`Checking existence of event ID: ${eventId}`)
      return Ok(this.storage.has(eventId))
    } catch (error) {
      this.logger.error(`Failed to check event existence: ${error}`)
      return Err(FindAllRepoError('Failed to check event existence'))
    }
  }
}

export default function EventRepository(logger: Logger): EventRepository {
  return new InMemoryEventRepository(logger)
}
