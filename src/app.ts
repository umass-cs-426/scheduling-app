import Logger from './logging/Logging'
import SchedulingWebServer from './web/SchedulingWebServer'

const logger = Logger('App', { kind: 'ConsoleLogger' })
const server = SchedulingWebServer(logger, [])

server.start(3000)
