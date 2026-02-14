import Logger from './logging/Logging'
import { SchedulingWebServer } from './web/SchedulingWebServer'
import { AvailabilityRouter } from './web/routers/AvailabilityRouter'
import { AvailabilityPort } from './availability/AvailabilityPort'
import { EventPort } from './event/EventPort'
import { EventRouter } from './web/routers/EventRouter'

const logger = Logger('App', { kind: 'ConsoleLogger' })
const eventPort = EventPort(logger)
const availabilityPort = AvailabilityPort(logger, eventPort)
const server = SchedulingWebServer(logger, [
  AvailabilityRouter(logger, availabilityPort),
  EventRouter(logger, eventPort),
])

server.start(3000)
