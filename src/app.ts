import dotenv from 'dotenv'
import Logger from './logging/Logging'
import { SchedulingWebServer } from './web/SchedulingWebServer'
import { AvailabilityRouter } from './web/routers/AvailabilityRouter'
import { AvailabilityPort } from './availability/AvailabilityPort'
import { EventPort } from './event/EventPort'
import { EventRouter } from './web/routers/EventRouter'

// Load environment variables from .env so configuration is easy to change
// without editing code.
dotenv.config()

const logger = Logger('App', { kind: 'ConsoleLogger' })
const eventPort = EventPort(logger)
const availabilityPort = AvailabilityPort(logger, eventPort)
const server = SchedulingWebServer(
  logger,
  [
    AvailabilityRouter(logger, availabilityPort, eventPort),
    EventRouter(logger, eventPort),
  ],
  eventPort,
)

const port = Number(process.env.PORT) || 3000
server.start(port)
