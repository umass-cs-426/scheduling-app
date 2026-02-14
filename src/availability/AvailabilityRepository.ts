import Availability from './Availability'
import { Result, Ok, Err } from '../types/Result'
import { Logger } from '../logging/Logging'

// Define the RepositoryError type, which represents errors that can occur in
// the repository. This type can be extended to include specific error types
// for different operations (e.g., saving, deleting, finding). For now, it is a
// simple object with a message property, but it can be expanded in the future
// to include more detailed error information.
type BaseRepoError = { message: string }
export type FailedToSaveError = BaseRepoError & { kind: 'FailedToSave' }
export type FailedToDeleteError = BaseRepoError & { kind: 'FailedToDelete' }
export type FailedToFindError = BaseRepoError & { kind: 'FailedToFind' }
export type RepositoryError =
  | FailedToSaveError
  | FailedToDeleteError
  | FailedToFindError

// A factory functions for creating specific repository errors.
function FailedToSaveError(message: string): FailedToSaveError {
  return { kind: 'FailedToSave', message }
}

function FailedToDeleteError(message: string): FailedToDeleteError {
  return { kind: 'FailedToDelete', message }
}

function FailedToFindError(message: string): FailedToFindError {
  return { kind: 'FailedToFind', message }
}

// The AvailabilityRepository interface defines the methods that any
// implementation of the repository must provide.
export default interface AvailabilityRepository {
  save: (a: Availability) => Result<Availability, RepositoryError>
  delete: (id: string) => Result<Availability, RepositoryError>
  find: (id: string) => Result<Availability, RepositoryError>
  findByEventId: (eventId: string) => Result<Availability[], RepositoryError>
}

// The InMemoryAvailabilityRepository is a simple implementation of the
// AvailabilityRepository interface that uses an in-memory Map to store
// availabilities. This is a basic implementation for demonstration purposes,
// and it can be replaced with a more robust implementation (e.g., using a
// database) in the future.
class InMemoryAvailabilityRepository implements AvailabilityRepository {
  // The storage property is a Map that holds the availabilities, keyed by
  // their ID.
  private storage: Map<string, Availability> = new Map()

  // The constructor takes a Logger instance, which can be used to log messages
  // related to repository operations. This allows us to have visibility into
  // the repository's behavior and can help with debugging and monitoring.
  constructor(private logger: Logger) {
    this.logger.info('InMemoryAvailabilityRepository initialized')
  }

  // The save method takes an Availability object and saves it to the
  // repository. It returns a Result that indicates whether the save operation
  // was successful or if it failed with a RepositoryError. In this
  // implementation, we will simply add the availability to the in-memory
  // storage and return an Ok result. In a real application, this would involve
  // saving the availability to a database, and we would need to handle
  // potential errors that could occur during the save operation.
  save(a: Availability): Result<Availability, RepositoryError> {
    try {
      this.logger.info(`Saving availability: ${JSON.stringify(a)}`)
      this.storage.set(a.id, a)
      return Ok(a)
    } catch (error) {
      this.logger.error(`Failed to save availability: ${error}`)
      return Err(FailedToSaveError(`Failed to save availability: ${error}`))
    }
  }

  // The delete method takes an availability ID and deletes the corresponding
  // availability from the repository. It returns a boolean indicating whether
  // the delete operation was successful. In this implementation, we will simply
  // remove the availability from the in-memory storage and return true if the
  // availability was found and deleted, or false if it was not found. In a real
  // application, this would involve deleting the availability from a database,
  // and we would need to handle potential errors that could occur during the
  // delete operation.
  delete(id: string): Result<Availability, RepositoryError> {
    try {
      const availability = this.storage.get(id)
      if (availability) {
        this.logger.info(`Deleting availability with ID: ${id}`)
        this.storage.delete(id)
        return Ok(availability)
      } else {
        this.logger.warn(
          `Failed to delete availability with ID ${id}: not found`,
        )
        return Err(
          FailedToDeleteError(
            `Failed to delete availability with ID ${id}: not found`,
          ),
        )
      }
    } catch (error) {
      this.logger.error(`Failed to delete availability with ID ${id}: ${error}`)
      return Err(
        FailedToDeleteError(
          `Failed to delete availability with ID ${id}: ${error}`,
        ),
      )
    }
  }

  // The find method takes an availability ID and returns an Option containing
  // the corresponding Availability object if it exists, or None if it does
  // not. In this implementation, we will simply look up the availability in the
  // in-memory storage and return an Option based on whether the availability
  // exists. In a real application, this would involve querying the database for
  // the availability with the specified ID, and we would need to handle
  // potential errors that could occur during the find operation.
  find(id: string): Result<Availability, RepositoryError> {
    try {
      this.logger.info(`Finding availability with ID: ${id}`)
      const avail = this.storage.get(id)
      if (avail) {
        this.logger.info(`Found availability with ID: ${id}`)
        return Ok(avail)
      } else {
        return Err(
          FailedToFindError(
            `Failed to find availability with ID ${id}: not found`,
          ),
        )
      }
    } catch (error) {
      this.logger.error(`Failed to find availability with ID ${id}: ${error}`)
      return Err(
        FailedToFindError(
          `Failed to find availability with ID ${id}: ${error}`,
        ),
      )
    }
  }

  // The findByEventId method takes an event ID and returns an array of
  // Availability objects that are associated with that event ID. In this
  // implementation, we will iterate through the in-memory storage and collect
  // all availabilities that have the specified event ID. In a real application,
  // this would involve querying the database for availabilities with the
  // specified event ID, and we would need to handle potential errors that could
  // occur during the find operation.
  findByEventId(eventId: string): Result<Availability[], RepositoryError> {
    try {
      this.logger.info(`Finding availabilities for event ID: ${eventId}`)
      const availabilities: Availability[] = []
      for (const availability of this.storage.values()) {
        if (availability.eventId === eventId) {
          availabilities.push(availability)
        }
      }
      this.logger.info(
        `Found ${availabilities.length} availabilities for event ID: ${eventId}`,
      )
      return Ok(availabilities)
    } catch (error) {
      this.logger.error(
        `Failed to find availabilities for event ID ${eventId}: ${error}`,
      )
      return Err(
        FailedToFindError(
          `Failed to find availabilities for event ID ${eventId}: ${error}`,
        ),
      )
    }
  }
}

// The AvailabilityRepository function is a factory function that creates and
// returns an instance of the InMemoryAvailabilityRepository. This allows us to
// abstract away the specific implementation of the repository and makes it easy
// to replace the in-memory implementation with a different one (e.g., using a
// database) in the future without affecting the rest of the application.
export function AvailabilityRepository(logger: Logger): AvailabilityRepository {
  return new InMemoryAvailabilityRepository(logger)
}
