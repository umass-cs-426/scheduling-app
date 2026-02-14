import Time from '../types/Time'

// The Availability interface defines the structure of an availability object.
export interface Availability {
  id: string
  eventId: string
  name: string
  startTime: Time
  endTime: Time
}

// The AvailabilityImplementation class is a concrete implementation of the
// Availability interface. It provides a constructor for creating new
// availability objects with the specified properties.
class AvailabilityImplementation implements Availability {
  constructor(
    public id: string,
    public eventId: string,
    public name: string,
    public startTime: Time,
    public endTime: Time,
  ) {}
}

// The Availability function is a factory function that creates a new
// Availability object with the specified properties.
export function Availability(
  name: string,
  eventId: string,
  startTime: Time,
  endTime: Time,
): Availability {
  const id = `${eventId}-${name}-${Date.now()}`
  return new AvailabilityImplementation(id, eventId, name, startTime, endTime)
}

export default Availability
