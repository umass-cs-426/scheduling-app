import Express, { Router } from 'express'
import { AvailabilityController } from '../controllers/AvailabilityController'

export interface AvailabilityRouter {
  getRouter(): Router
}

class DefaultAvailabilityRouter implements AvailabilityRouter {
  private router: Router

  constructor(private availabilityController: AvailabilityController) {
    this.router = this.initRouter()
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

export default function AvailabilityRouter(
  availabilityController: AvailabilityController,
): AvailabilityRouter {
  return new DefaultAvailabilityRouter(availabilityController)
}
