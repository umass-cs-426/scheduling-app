import { Request, Response } from 'express'
import { EventPort } from '../../event/EventPort'

export interface IEventController {
  list(req: Request, res: Response): void
  create(req: Request, res: Response): void
}

export class EventController implements IEventController {
  constructor(private eventPort: EventPort) {}

  list(_req: Request, res: Response): void {
    const result = this.eventPort.list()
    if (!result.ok) {
      res.status(500).json({ error: result.error })
      return
    }
    res.json(result.value)
  }

  create(req: Request, res: Response): void {
    const { title, date } = req.body

    if (typeof title !== 'string' || title.trim() === '') {
      res.status(400).json({ error: 'title is required' })
      return
    }

    if (typeof date !== 'string' || date.trim() === '') {
      res.status(400).json({ error: 'date is required' })
      return
    }

    // const event = this.service.createEvent(title, date)
    

    res.status(201).json(event)
  }
}
