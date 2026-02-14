import Express, { Router } from 'express'
import { AvailabilityController } from '../controllers/AvailabilityController'
import { SchedulingRouter } from './SchedulingRouter'
import { Logger } from '../../logging/Logging'
import { AvailabilityPort } from '../../availability/AvailabilityPort'

class DefaultAvailabilityRouter implements SchedulingRouter {
  private router: Router

  constructor(
    private logger: Logger,
    private availabilityPort: AvailabilityPort,
  ) {
    this.router = this.initRouter()
  }

  getName(): string {
    return 'AvailabilityRouter'
  }

  initRouter(): Router {
    const router = Router()
    const jsonMW = Express.json()

    router.post('/availability', jsonMW, (req, res) =>
      res.status(501).json({ error: 'Not implemented' }),
    )

    router.get('/availability/:id', (req, res) => {
      res.status(501).json({ error: 'Not implemented' })
    })

    router.put('/availability/:id', jsonMW, (req, res) => {
      res.status(501).json({ error: 'Not implemented' })
    })

    return router
  }

  getRouter(): Router {
    return this.router
  }
}

export function AvailabilityRouter(
  logger: Logger,
  availabilityPort: AvailabilityPort,
): SchedulingRouter {
  return new DefaultAvailabilityRouter(logger, availabilityPort)
}
