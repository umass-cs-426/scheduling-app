import Event from './Event'
import EventRepository from './EventRepository'

export type EventService = {
  // Creates a new event with the given title and date
  createEvent(title: string, date: string): Event
  // Lists all events
  listEvents(): Event[]
}

const EventService: EventService = {
  createEvent(title: string, date: string): Event {
    const id = Math.random().toString(36).substring(2, 9)
    EventRepository.save({ id, title, date })
    return { id, title, date }
  },

  listEvents(): Event[] {
    return EventRepository.findAll()
  },
}

export default EventService
