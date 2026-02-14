import { Time } from '../../types/Time'

export interface ValidatedAvailabilityDto {
  eventId: string
  name: string
  startTime: Time
  endTime: Time
}

export function ValidatedAvailabilityDto(
  eventId: string,
  name: string,
  startTime: Time,
  endTime: Time,
): ValidatedAvailabilityDto {
  return { eventId, name, startTime, endTime }
}
