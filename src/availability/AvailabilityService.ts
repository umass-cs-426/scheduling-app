import { Logger } from '../logging/Logging'
import { Time } from '../types/Time'
import { Err, Ok, Result } from '../types/Result'
import { Availability } from './Availability'
import { AvailabilityRepository } from './AvailabilityRepository'
import { EventPort } from '../event/EventPort'
import { CreateAvailabilityInputDto } from './dto/CreateAvailabilityInputDto'
import { ValidatedAvailabilityDto } from './dto/ValidatedAvailabilityDto'

type BaseServiceError = { message: string }
type SubmitServiceError = BaseServiceError & { kind: 'SubmitServiceError' }
type ListServiceError = BaseServiceError & { kind: 'ListServiceError' }
type DeleteServiceError = BaseServiceError & { kind: 'DeleteServiceError' }
type ValidateTimeError = BaseServiceError & { kind: 'ValidateTimeError' }

export type ServiceError =
  | SubmitServiceError
  | ListServiceError
  | DeleteServiceError
  | ValidateTimeError

function SubmitServiceError(message: string): SubmitServiceError {
  return { kind: 'SubmitServiceError', message }
}

function ValidateTimeError(message: string): ValidateTimeError {
  return { kind: 'ValidateTimeError', message }
}

function ListServiceError(message: string): ListServiceError {
  return { kind: 'ListServiceError', message }
}

function DeleteServiceError(message: string): DeleteServiceError {
  return { kind: 'DeleteServiceError', message }
}

export interface AvailabilityService {
  submit: (
    dto: CreateAvailabilityInputDto,
  ) => Promise<Result<Availability, ServiceError>>
  list: (eventId: string) => Promise<Result<Availability[], ServiceError>>
  delete: (availabilityId: string) => Promise<Result<Availability, ServiceError>>
}

class BasicAvailabilityService implements AvailabilityService {
  constructor(
    private logger: Logger,
    private eventPort: EventPort,
    private repository: AvailabilityRepository,
  ) {}

  async submit(
    dto: CreateAvailabilityInputDto,
  ): Promise<Result<Availability, ServiceError>> {
    const { eventId, name, startTime, endTime } = dto
    // Check if the event exists using the EventPort
    const existsResult = await this.eventPort.exists(eventId)
    if (!existsResult.ok) {
      this.logger.error(
        `Failed to check event existence: ${existsResult.error.message}`,
      )
      return Err(SubmitServiceError('Failed to check event existence'))
    }

    // Validate start time and convert into Time type
    const startTimeResult = this.validateTime(startTime)
    if (!startTimeResult.ok) {
      this.logger.error(startTimeResult.error.message)
      return startTimeResult
    }

    // Validate end time and convert into Time type
    const endTimeResult = this.validateTime(endTime)
    if (!endTimeResult.ok) {
      this.logger.error(endTimeResult.error.message)
      return endTimeResult
    }

    // Create the validated availability object
    // Build the validated availability with the correct field order.
    const availability = ValidatedAvailabilityDto(
      eventId,
      name,
      startTimeResult.value,
      endTimeResult.value,
    )

    // Save the availability to the repository
    this.logger.info(`Submitting availability: ${JSON.stringify(availability)}`)
    const result = await this.repository.save(availability)
    if (!result.ok) {
      this.logger.error(
        `Failed to submit availability: ${result.error.message}`,
      )
      return Err(SubmitServiceError('Failed to submit availability'))
    }

    // Finally, return the created availability
    return result
  }

  async list(eventId: string): Promise<Result<Availability[], ServiceError>> {
    this.logger.info(`Listing availabilities for event ID: ${eventId}`)
    const result = await this.repository.findByEventId(eventId)
    if (!result.ok) {
      this.logger.error(
        `Failed to list availabilities: ${result.error.message}`,
      )
      return Err(ListServiceError('Failed to list availabilities'))
    }
    return result
  }

  async delete(
    availabilityId: string,
  ): Promise<Result<Availability, ServiceError>> {
    this.logger.info(`Deleting availability with ID: ${availabilityId}`)
    const result = await this.repository.delete(availabilityId)
    if (!result.ok) {
      this.logger.error(
        `Failed to delete availability: ${result.error.message}`,
      )
      return Err(DeleteServiceError('Failed to delete availability'))
    }
    return result
  }

  private validateTime(timeStr: string): Result<Time, ServiceError> {
    const timeResult = Time.of(timeStr)
    if (!timeResult.ok) {
      return Err(ValidateTimeError(`Invalid time format: ${timeResult.error}`))
    }
    return Ok(timeResult.value)
  }
}

export function AvailabilityService(
  logger: Logger,
  eventPort: EventPort,
  repo: AvailabilityRepository,
): AvailabilityService {
  return new BasicAvailabilityService(logger, eventPort, repo)
}
