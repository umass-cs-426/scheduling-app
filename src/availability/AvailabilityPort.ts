// This is the public interface for the Availability module. It defines the
// types and functions that are exposed to other modules in the application.

import { EventPort } from '../event/EventPort'
import { Logger } from '../logging/Logging'
import { Result, Ok, Err } from '../types/Result'
import { Availability } from './Availability'
import { AvailabilityRepository } from './AvailabilityRepository'
import { AvailabilityService } from './AvailabilityService'
import { CreateAvailabilityInputDto } from './dto/CreateAvailabilityInputDto'

export interface AvailabilityPort {
  submit: (
    eventId: string,
    name: string,
    startTime: string,
    endTime: string,
  ) => Promise<Result<Availability, string>>
  list: (eventId: string) => Promise<Result<Availability[], string>>
  delete: (availabilityId: string) => Promise<Result<Availability, string>>
}

class LocalAvailabilityPort implements AvailabilityPort {
  constructor(private service: AvailabilityService) {}

  async submit(
    eventId: string,
    name: string,
    startTime: string,
    endTime: string,
  ): Promise<Result<Availability, string>> {
    // Submit the availability using the service
    const dto = CreateAvailabilityInputDto(eventId, name, startTime, endTime)
    const saveResult = await this.service.submit(dto)

    // Check if the submission was successful
    if (!saveResult.ok) {
      return Err(`Failed to save availability: ${saveResult.error}`)
    }

    // Return the saved availability
    return saveResult
  }

  async list(eventId: string): Promise<Result<Availability[], string>> {
    // Simulate fetching availability for an event
    const availabilities = await this.service.list(eventId)
    if (!availabilities.ok) {
      return Err(`Failed to fetch availability: ${availabilities.error}`)
    }

    return Ok(availabilities.value)
  }

  async delete(availabilityId: string): Promise<Result<Availability, string>> {
    const result = await this.service.delete(availabilityId)
    if (!result.ok) {
      return Err(`Failed to delete availability: ${result.error}`)
    }
    return Ok(result.value)
  }
}

export function AvailabilityPort(
  logger: Logger,
  eventPort: EventPort,
): AvailabilityPort {
  const repo = AvailabilityRepository(logger)
  const service = AvailabilityService(logger, eventPort, repo)
  return new LocalAvailabilityPort(service)
}
