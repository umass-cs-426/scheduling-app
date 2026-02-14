export interface CreateAvailabilityInputDto {
  eventId: string
  name: string
  startTime: string
  endTime: string
}

export function CreateAvailabilityInputDto(
  eventId: string,
  name: string,
  startTime: string,
  endTime: string,
): CreateAvailabilityInputDto {
  return { eventId, name, startTime, endTime }
}
