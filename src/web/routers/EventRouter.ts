import Express, { Router, Request, Response } from 'express'
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
    this.logger = logger.derive('EventRouter')
    this.logger.info('EventRouter Created')
    this.router = this.initRouter()
  }

  getName(): string {
    return 'EventRouter'
  }

  getPathPrefix(): string {
    return '/events'
  }

  initRouter(): Router {
    const router = Router()

    // Create a JSON middleware instance to parse JSON bodies
    const jsonMW = Express.json()

    router.post(
      '/create',
      jsonMW,
      // Create a new event using the eventPort.
      this.asyncHandler(async (req, res) => {
        this.logger.info(`Create event hit: ${JSON.stringify(req.body)}`)
        const { title, date } = req.body
        this.logger.info(
          `Received request to create event: ${title} on ${date}`,
        )

        const result = await this.eventPort.create(title, date)
        if (!result.ok) {
          this.logger.error(`Error creating event: ${result.error}`)
          this.respondInternalError(res)
          return
        }

        // If this is an HTMX request, we want to return the updated events
        // fragment so the UI can update. Otherwise, we just return the
        // created event as JSON.
        if (this.isHtmxRequest(req)) {
          await this.renderEventsFragment(res, true)
          return
        }

        res.json({ event: result.value })
      }),
    )

    router.get(
      '/all',
      this.asyncHandler(async (_req, res) => {
        this.logger.info('Received request to list events')
        const events = await this.eventPort.list()
        if (events.ok) {
          res.json({ events: events.value })
          return
        }
        this.logger.error(`Error listing events: ${events.error}`)
        this.respondInternalError(res)
      }),
    )

    router.get(
      '/fragment',
      this.asyncHandler(async (_req, res) => {
        await this.renderEventsFragment(res, true)
      }),
    )

    router.get(
      '/select',
      this.asyncHandler(async (_req, res) => {
        const events = await this.eventPort.list()
        if (!events.ok) {
          this.logger.error(`Error listing events: ${events.error}`)
          this.respondInternalError(res)
          return
        }
        const selected = this.readSelectedEventId(_req)
        res.render('partials/event-select', {
          events: events.value,
          oob: false,
          selectedEventId: selected,
        })
      }),
    )

    router.get('/read/:id', (req, res) => {
      res.status(501).json({ error: 'Not implemented' })
    })

    router.put('/update/:id', jsonMW, (req, res) => {
      res.status(501).json({ error: 'Not implemented' })
    })

    // Catch-all to confirm requests are hitting this router.
    router.use((req, res) => {
      this.logger.info(
        `Unhandled EventRouter request: ${req.method} ${req.originalUrl}`,
      )
      res.status(404).json({ error: 'Not found' })
    })

    return router
  }

  // This is an important helper function. If something goes wrong in an async
  // route handler and we throw an error, it will be caught here and we can log
  // it and respond with a 500. Otherwise, the request would just hang and the
  // client would never get a response.
  //
  // This is ugly, but it's a common pattern in Express apps to handle errors
  // in async route handlers. There are libraries like express-async-errors
  // that can automate this, but I wanted to show it explicitly here.
  private asyncHandler(fn: (req: Request, res: Response) => Promise<void>) {
    return async (req: Express.Request, res: Express.Response) => {
      try {
        await fn(req, res)
      } catch (error) {
        this.logger.error(`EventRouter error: ${error}`)
        this.respondInternalError(res)
      }
    }
  }

  private respondInternalError(res: Express.Response) {
    res.status(500).json({ error: 'Internal server error' })
  }

  private isHtmxRequest(req: Express.Request): boolean {
    return req.get('HX-Request') === 'true'
  }

  // This method renders the events fragment, which is a partial view that contains
  // the list of events. This is used in response to HTMX requests so that we can
  // update just the events list in the UI without reloading the entire page.
  private async renderEventsFragment(
    res: Express.Response,
    triggerAvailabilityRefresh: boolean,
  ) {
    const events = await this.eventPort.list()
    if (!events.ok) {
      this.logger.error(`Error listing events: ${events.error}`)
      this.respondInternalError(res)
      return
    }
    if (triggerAvailabilityRefresh) {
      res.set('HX-Trigger', 'events-updated')
    }
    res.render('partials/events-fragment', { events: events.value })
  }

  private readSelectedEventId(req: Express.Request): string | null {
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
