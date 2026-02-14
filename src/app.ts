import express from 'express'
import path from 'node:path'

import { InMemoryEventRepository } from './event/InMemoryEventRepository'
import { EventService } from './event/EventServiceOri'
import { InMemoryAvailabilityRepository } from './availability/InMemoryAvailabilityRepository'
import { AvailabilityService } from './availability/AvailabilityServiceOri'
import { EventController } from './web/EventController'
import { AvailabilityController } from './web/AvailabilityController'
import { buildRoutes } from './web/routes'

const app = express()

app.use(express.json())
app.use(express.static('static'))

app.set('view engine', 'ejs')
app.set('views', path.join(process.cwd(), 'src', 'ui', 'views'))

app.get('/health', (_req, res) => res.json({ ok: true }))
app.get('/', (_req, res) => res.render('index'))

const eventRepo = new InMemoryEventRepository()
const eventService = new EventService(eventRepo)
const eventController = new EventController(eventService)

const availabilityRepo = new InMemoryAvailabilityRepository()
const availabilityService = new AvailabilityService(
  availabilityRepo,
  eventService,
)
const availabilityController = new AvailabilityController(availabilityService)

app.use(buildRoutes(eventController, availabilityController))

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000')
})
