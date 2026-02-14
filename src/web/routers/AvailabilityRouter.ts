import Express, { Router } from 'express'
import { SchedulingRouter } from './SchedulingRouter'
import { Logger } from '../../logging/Logging'
import { AvailabilityPort } from '../../availability/AvailabilityPort'
import { EventPort } from '../../event/EventPort'

class DefaultAvailabilityRouter implements SchedulingRouter {
  private router: Router

  constructor(
    private logger: Logger,
    private availabilityPort: AvailabilityPort,
    private eventPort: EventPort,
  ) {
    this.logger = logger.derive('AvailabilityRouter')
    this.logger.info('AvailabilityRouter Created')
    this.router = this.initRouter()
  }

  getName(): string {
    return 'AvailabilityRouter'
  }

  getPathPrefix(): string {
    return '/availability'
  }

  initRouter(): Router {
    const router = Router()
    const jsonMW = Express.json()

    router.post(
      '/create',
      jsonMW,
      // Create a new availability for an event.
      this.asyncHandler(async (req, res) => {
        const payload = req.body || {}
        const { eventId, name, startTime, endTime } = payload

        // Validate required inputs so we can give a helpful error early.
        if (!eventId || !name || !startTime || !endTime) {
          res
            .status(400)
            .json({
              error: 'eventId, name, startTime, and endTime are required',
            })
          return
        }

        const result = await this.availabilityPort.submit(
          eventId,
          name,
          startTime,
          endTime,
        )

        if (!result.ok) {
          this.logger.error(`Error creating availability: ${result.error}`)
          this.respondInternalError(res)
          return
        }

        if (this.isHtmxRequest(req)) {
          await this.renderAvailabilityFragment(res)
          return
        }

        res.json({ availability: result.value })
      }),
    )

    router.get('/all', (req, res) => {
      this.logger.info('Received request to list availability')
      res.status(501).json({ error: 'Not implemented' })
    })

    router.get('/read/:id', (req, res) => {
      res.status(501).json({ error: 'Not implemented' })
    })

    router.get(
      '/read',
      // List availability entries for a specific event.
      this.asyncHandler(async (req, res) => {
        const eventId = this.readEventIdFromQuery(req)
        if (!eventId) {
          res.status(400).json({ error: 'eventId is required' })
          return
        }

        const result = await this.availabilityPort.list(eventId)
        if (!result.ok) {
          this.logger.error(`Error listing availability: ${result.error}`)
          this.respondInternalError(res)
          return
        }

        res.json({ availability: result.value })
      }),
    )

    router.get(
      '/fragment',
      // Render the availability list as an HTML fragment for htmx swaps.
      this.asyncHandler(async (_req, res) => {
        await this.renderAvailabilityFragment(res)
      }),
    )

    router.delete(
      '/delete/:id',
      // Delete an availability entry by ID.
      this.asyncHandler(async (req, res) => {
        const { id } = req.params
        if (!id) {
          res.status(400).json({ error: 'availability id is required' })
          return
        }

        const result = await this.availabilityPort.delete(id)
        if (!result.ok) {
          this.logger.error(`Error deleting availability: ${result.error}`)
          this.respondInternalError(res)
          return
        }

        if (this.isHtmxRequest(req)) {
          await this.renderAvailabilityFragment(res)
          return
        }

        res.json({ availability: result.value })
      }),
    )

    router.put('/update/:id', jsonMW, (req, res) => {
      res.status(501).json({ error: 'Not implemented' })
    })

    router.put('/update', jsonMW, (req, res) => {
      const { eventId } = req.body || {}
      if (!eventId) {
        res.status(400).json({ error: 'eventId is required' })
        return
      }
      res.status(501).json({ error: 'Not implemented' })
    })

    return router
  }

  // Wrap async handlers so we can catch errors and return a 500 consistently.
  private asyncHandler(
    fn: (req: Express.Request, res: Express.Response) => Promise<void>,
  ) {
    return async (req: Express.Request, res: Express.Response) => {
      try {
        await fn(req, res)
      } catch (error) {
        this.logger.error(`AvailabilityRouter error: ${error}`)
        this.respondInternalError(res)
      }
    }
  }

  // Small helper to keep error responses consistent.
  private respondInternalError(res: Express.Response) {
    res.status(500).json({ error: 'Internal server error' })
  }

  // htmx sets HX-Request=true, which we can use to choose HTML vs JSON.
  private isHtmxRequest(req: Express.Request): boolean {
    return req.get('HX-Request') === 'true'
  }

  // Read eventId from a query string like /availability/read?eventId=abc
  private readEventIdFromQuery(req: Express.Request): string | null {
    const value = req.query.eventId
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim()
    }
    if (Array.isArray(value) && value.length > 0) {
      const first = value[0]
      if (typeof first === 'string' && first.trim().length > 0) {
        return first.trim()
      }
    }
    return null
  }

  // Build a grouped list of availability by event so the UI can show
  // "All events" with their matching availability entries.
  private async loadAvailabilityByEvent() {
    const eventsResult = await this.eventPort.list()
    if (!eventsResult.ok) {
      this.logger.error(`Error listing events: ${eventsResult.error}`)
      return []
    }

    const availabilityByEvent = []
    for (const event of eventsResult.value) {
      const availabilityResult = await this.availabilityPort.list(event.id)
      if (!availabilityResult.ok) {
        this.logger.error(
          `Error listing availability for event ${event.id}: ${availabilityResult.error}`,
        )
        availabilityByEvent.push({ event, availability: [] })
        continue
      }
      availabilityByEvent.push({
        event,
        availability: availabilityResult.value,
      })
    }

    return availabilityByEvent
  }

  private async renderAvailabilityFragment(res: Express.Response) {
    const availabilityByEvent = await this.loadAvailabilityByEvent()
    res.render('partials/availability-fragment', { availabilityByEvent })
  }

  getRouter(): Router {
    return this.router
  }
}

export function AvailabilityRouter(
  logger: Logger,
  availabilityPort: AvailabilityPort,
  eventPort: EventPort,
): SchedulingRouter {
  return new DefaultAvailabilityRouter(logger, availabilityPort, eventPort)
}
