import Express, { Router } from 'express'
import { EventController } from '../controllers/EventController'
import { EventPort } from '../../event/EventPort'
import { Logger } from '../../logging/Logging'
import { SchedulingRouter } from './SchedulingRouter'

class DefaultEventRouter implements SchedulingRouter {
  private router: Router

  constructor(
    private logger: Logger,
    private eventPort: EventPort,
  ) {
    this.logger.info('EventRouter Created')
    this.router = this.initRouter()
  }

  getName(): string {
    return 'EventRouter'
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

export function EventRouter(
  logger: Logger,
  eventPort: EventPort,
): SchedulingRouter {
  return new DefaultEventRouter(logger, eventPort)
}
