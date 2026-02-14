import { Request, Response } from 'express'
import AvailabilityService from '../availability/AvailabilityService'

export interface AvailabilityController {
  listForEvent(req: Request, res: Response): void
  submitForEvent(req: Request, res: Response): void
}

class DefaultAvailabilityController implements AvailabilityController {
  constructor(private service: AvailabilityService) {}

  listForEvent(req: Request, res: Response): void {
    const eventId = req.params.eventId as string
    res.json(this.service.list(eventId))
  }

  submitForEvent(req: Request, res: Response): void {
    const eventId = req.params.eventId as string
    const { name, timeSlot } = req.body

    if (typeof name !== 'string' || name.trim() === '') {
      res.status(400).json({ error: 'name is required' })
      return
    }

    if (typeof timeSlot !== 'string' || timeSlot.trim() === '') {
      res.status(400).json({ error: 'timeSlot is required' })
      return
    }

    const result = this.service.submit(eventId, name, timeSlot)

    if (!result.ok) {
      res.status(404).json({ error: result.error })
      return
    }

    res.status(201).json(result.value)
  }
}
