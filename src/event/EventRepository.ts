import { Result, Ok } from '../types/Result'
import Event from './Event'

// The RepositoryError type represents an error that can occur when interacting
// with the event repository.
export type RepositoryError = { message: string }

// The EventRepository type defines the interface for a repository that manages
// events. It includes methods for saving an event and retrieving all events.
export type EventRepository = {
  save(event: Event): Result<Event, RepositoryError>
  findAll(): Event[]
}

// The Storage variable is an in-memory storage for events.
const Storage = new Map<string, Event>()

const EventRepository: EventRepository = {
  // The save method takes an Event object and saves it to the repository.
  save(event: Event): Result<Event, RepositoryError> {
    Storage.set(event.id, event)
    return Ok(event)
  },

  // The findAll method retrieves all events from the repository. In this
  // implementation, we will return an empty array. In a real application, this
  // would involve querying the database for all events.
  findAll(): Event[] {
    return Array.from(Storage.values())
  },
}

export default EventRepository
