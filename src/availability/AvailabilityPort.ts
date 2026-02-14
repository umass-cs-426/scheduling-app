// This is the public interface for the Availability module. It defines the
// types and functions that are exposed to other modules in the application.

import { EventPort } from '../event/EventPort'
import { Logger } from '../logging/Logging'
import { Result, Ok, Err } from '../types/Result'
import { AvailabilityRepository } from './AvailabilityRepository'
import { AvailabilityService } from './AvailabilityService'
import { CreateAvailabilityInputDto } from './dto/CreateAvailabilityInputDto'
import { AvailabilityOutputDto } from './dto/AvailabilityOutputDto'
import { PortError } from '../types/PortError'

export interface AvailabilityPort {
  submit: (
    dto: CreateAvailabilityInputDto,
  ) => Promise<Result<AvailabilityOutputDto, PortError>>
  list: (eventId: string) => Promise<Result<AvailabilityOutputDto[], PortError>>
  delete: (
    availabilityId: string,
  ) => Promise<Result<AvailabilityOutputDto, PortError>>
}

class LocalAvailabilityPort implements AvailabilityPort {
  constructor(private service: AvailabilityService) {}

  async submit(
    dto: CreateAvailabilityInputDto,
  ): Promise<Result<AvailabilityOutputDto, PortError>> {
    // Submit the availability using the service
    const saveResult = await this.service.submit(dto)

    // Check if the submission was successful
    if (!saveResult.ok) {
      return Err(
        PortError('Failed to save availability', { cause: saveResult.error }),
      )
    }

    // Return the saved availability
    return Ok(AvailabilityOutputDto(saveResult.value))
  }

  async list(
    eventId: string,
  ): Promise<Result<AvailabilityOutputDto[], PortError>> {
    // Simulate fetching availability for an event
    const availabilities = await this.service.list(eventId)
    if (!availabilities.ok) {
      return Err(
        PortError('Failed to fetch availability', {
          cause: availabilities.error,
        }),
      )
    }

    return Ok(availabilities.value.map(AvailabilityOutputDto))
  }

  async delete(
    availabilityId: string,
  ): Promise<Result<AvailabilityOutputDto, PortError>> {
    const result = await this.service.delete(availabilityId)
    if (!result.ok) {
      return Err(
        PortError('Failed to delete availability', { cause: result.error }),
      )
    }
    return Ok(AvailabilityOutputDto(result.value))
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
