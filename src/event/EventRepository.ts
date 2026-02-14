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
  save(event: Event): Result<Event, RepositoryError>
  findAll(): Result<Event[], RepositoryError>
  exists(eventId: string): Result<boolean, RepositoryError>
}

class InMemoryEventRepository implements EventRepository {
  private storage: Map<string, Event> = new Map()

  constructor(private logger: Logger) {
    logger.info('InMemoryEventRepository initialized')
  }

  save(event: Event): Result<Event, RepositoryError> {
    try {
      this.logger.info(`Saving event: ${JSON.stringify(event)}`)
      this.storage.set(event.id, event)
      return Ok(event)
    } catch (error) {
      this.logger.error(`Failed to save event: ${error}`)
      return Err(SaveRepoError('Failed to save event'))
    }
  }

  findAll(): Result<Event[], RepositoryError> {
    try {
      this.logger.info('Retrieving all events')
      return Ok(Array.from(this.storage.values()))
    } catch (error) {
      this.logger.error(`Failed to retrieve events: ${error}`)
      return Err(FindAllRepoError('Failed to retrieve events'))
    }
  }

  exists(eventId: string): Result<boolean, RepositoryError> {
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
