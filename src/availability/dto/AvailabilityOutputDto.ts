import { Availability } from '../Availability'

// AvailabilityOutputDto defines the serialized shape we return to callers.
// We convert Time objects to strings so this can cross process boundaries.
export interface AvailabilityOutputDto {
  id: string
  eventId: string
  name: string
  startTime: string
  endTime: string
}

const pad2 = (value: number) => String(value).padStart(2, '0')

function timeToString(time: Availability['startTime']): string {
  return `${pad2(time.hours)}:${pad2(time.minutes)}`
}

export function AvailabilityOutputDto(
  availability: Availability,
): AvailabilityOutputDto {
  return {
    id: availability.id,
    eventId: availability.eventId,
    name: availability.name,
    startTime: timeToString(availability.startTime),
    endTime: timeToString(availability.endTime),
  }
}
