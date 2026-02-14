import { Request, Response } from 'express'
import { EventPort } from '../../event/EventPort'

export interface IEventController {
  list(req: Request, res: Response): void
  create(req: Request, res: Response): void
}

export class EventController implements IEventController {
  constructor(private eventPort: EventPort) {}

  async list(req: Request, res: Response): Promise<void> {
    const result = await this.eventPort.list()
    if (!result.ok) {
      res.status(500).json({ error: result.error })
      return
    }
    res.json(result.value)
  }

  async create(req: Request, res: Response): Promise<void> {
    const { title, date } = req.body

    // Validate the raw request data so we can return a helpful 400 response.
    if (typeof title !== 'string' || title.trim() === '') {
      res.status(400).json({ error: 'title is required' })
      return
    }

    if (typeof date !== 'string' || date.trim() === '') {
      res.status(400).json({ error: 'date is required' })
      return
    }

    // Pass the raw input to the port, which builds the DTO and handles the
    // flow.
    const result = await this.eventPort.create(req.body.title, req.body.date)
    if (!result.ok) {
      res.status(500).json({ error: result.error })
      return
    }

    // The port returns a CreateEventOutputDto that defines the response shape.
    res.status(201).json(result.value)
  }
}
