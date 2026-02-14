import { Logger } from '../logging/Logging'
import { Time } from '../types/Time'
import { Ok, Err, Result } from '../types/Result'
import Availability from './Availability'
import AvailabilityRepository from './AvailabilityRepository'

type BaseServiceError = { message: string }
type SubmitServiceError = BaseServiceError & { kind: 'SubmitServiceError' }
type ListServiceError = BaseServiceError & { kind: 'ListServiceError' }

export type ServiceError = SubmitServiceError | ListServiceError

function SubmitServiceError(message: string): SubmitServiceError {
  return { kind: 'SubmitServiceError', message }
}

function ListServiceError(message: string): ListServiceError {
  return { kind: 'ListServiceError', message }
}

interface AvailabilityService {
  submit: (
    eventId: string,
    name: string,
    startTime: Time,
    endTime: Time,
  ) => Result<Availability, ServiceError>
  list: (eventId: string) => Result<Availability[], ServiceError>
}

class BasicAvailabilityService implements AvailabilityService {
  constructor(
    private logger: Logger,
    private repository: AvailabilityRepository,
  ) {}

  submit(
    eventId: string,
    name: string,
    startTime: Time,
    endTime: Time,
  ): Result<Availability, ServiceError> {
    const availability = Availability(name, eventId, startTime, endTime)
    this.logger.info(`Submitting availability: ${JSON.stringify(availability)}`)
    const result = this.repository.save(availability)
    if (!result.ok) {
      this.logger.error(
        `Failed to submit availability: ${result.error.message}`,
      )
      return Err(SubmitServiceError('Failed to submit availability'))
    }
    return result
  }

  list(eventId: string): Result<Availability[], ServiceError> {
    this.logger.info(`Listing availabilities for event ID: ${eventId}`)
    const result = this.repository.findByEventId(eventId)
    if (!result.ok) {
      this.logger.error(
        `Failed to list availabilities: ${result.error.message}`,
      )
      return Err(ListServiceError('Failed to list availabilities'))
    }
    return result
  }
}

export function AvailabilityService(
  logger: Logger,
  repo: AvailabilityRepository,
): AvailabilityService {
  return new BasicAvailabilityService(logger, repo)
}
