export interface CreateAvailabilityOutputDto {
  id: string
  eventId: string
  name: string
  startTime: string
  endTime: string
}

export function CreateAvailabilityOutputDto(
  id: string,
  eventId: string,
  name: string,
  startTime: string,
  endTime: string,
): CreateAvailabilityOutputDto {
  return { id, eventId, name, startTime, endTime }
}
