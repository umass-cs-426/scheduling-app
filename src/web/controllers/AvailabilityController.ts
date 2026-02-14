import { Request, Response } from 'express'
import { AvailabilityService } from '../../availability/AvailabilityService'
import { AvailabilityPort } from '../../availability/AvailabilityPort'
import { Logger } from '../../logging/Logging'
import { CreateAvailabilityInputDto } from '../../availability/dto/CreateAvailabilityInputDto'

export interface AvailabilityController {
  listForEvent(req: Request, res: Response): void
  submitForEvent(req: Request, res: Response): void
}

class DefaultAvailabilityController implements AvailabilityController {
  constructor(
    private logger: Logger,
    private availabilityPort: AvailabilityPort,
  ) {}

  async listForEvent(req: Request, res: Response): Promise<void> {
    const eventId = req.params.eventId as string
    const result = await this.availabilityPort.list(eventId)
    res.json(result.ok ? result.value : { error: result.error.message })
  }

  async submitForEvent(req: Request, res: Response): Promise<void> {
    const eventId = req.params.eventId as string
    const { name, start, end } = req.body

    if (typeof name !== 'string' || name.trim() === '') {
      res.status(400).json({ error: 'name is required' })
      return
    }

    if (typeof start !== 'string' || start.trim() === '') {
      res.status(400).json({ error: 'start is required' })
      return
    }

    if (typeof end !== 'string' || end.trim() === '') {
      res.status(400).json({ error: 'end is required' })
      return
    }

    const dto = CreateAvailabilityInputDto(eventId, name, start, end)
    const result = await this.availabilityPort.submit(dto)

    if (!result.ok) {
      res.status(404).json({ error: result.error.message })
      return
    }

    res.status(201).json(result.value)
  }
}
