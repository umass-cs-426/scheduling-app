import Express, { Router } from 'express'
import { EventController } from '../controllers/EventController'

export interface EventRouter {
  getRouter(): Router
}

class DefaultEventRouter implements EventRouter {
  private router: Router

  constructor(private eventController: EventController) {
    this.router = this.initRouter()
  }

  initRouter(): Router {
    const router = Router()

    // Create a JSON middleware instance to parse JSON bodies
    const jsonMW = Express.json()

    router.post('/event', jsonMW, (req, res) =>
      res.status(501).json({ error: 'Not implemented' }),
    )

    router.get('/event/:id', (req, res) => {
      res.status(501).json({ error: 'Not implemented' })
    })

    router.put('/event/:id', jsonMW, (req, res) => {
      res.status(501).json({ error: 'Not implemented' })
    })

    return router
  }

  getRouter(): Router {
    return this.router
  }
}

export default function EventRouter(
  eventController: EventController,
): EventRouter {
  return new DefaultEventRouter(eventController)
}
