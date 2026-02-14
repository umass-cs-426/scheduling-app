import path from 'node:path'
import { Logger } from '../logging/Logging'
import Express, { Application, Router } from 'express'
import { SchedulingRouter } from './routers/SchedulingRouter'

// The SchedulingWebServer class is responsible for setting up and starting the
// Express web server for the scheduling application.
export interface SchedulingWebServer {
  start(port: number): void
}

// The default export function returns an instance of a SchedulingWebServer
export function SchedulingWebServer(
  logger: Logger,
  routers: SchedulingRouter[],
): SchedulingWebServer {
  const nlogger = logger.derive('SchedulingWebServer')
  return new BasicSchedulingWebServer(nlogger, routers)
}

// The BasicSchedulingWebServer class implements the SchedulingWebServer
// interface. It sets up the Express application with middleware, view engine,
// and routes, and provides a method to start the server on a specified port.
class BasicSchedulingWebServer implements SchedulingWebServer {
  private app: Application

  // The constructor initializes the SchedulingWebServer with a logger and an
  // array of routers.
  constructor(
    private logger: Logger,
    routers: SchedulingRouter[],
  ) {
    this.logger.info('SchedulingWebServer Created')
    this.app = this.initApp(routers)
  }

  // Returns the absolute path to the static directory, which is used by the
  // Express app to serve static files. The function constructs the path based
  // on the current working directory and the expected structure of the project.
  private staticDir(): string {
    const runningDir = process.cwd()
    // ./src/web/static
    const staticDir = path.join(runningDir, 'src', 'web', 'static')
    return staticDir
  }

  // Returns the absolute path to the views directory, which is used by the
  // Express app to render EJS templates. The function constructs the path based
  // on the current working directory and the expected structure of the project.
  private viewsDir(): string {
    const runningDir = process.cwd()
    // ./src/web/views
    const viewsDir = path.join(runningDir, 'src', 'web', 'views')
    return viewsDir
  }

  // Initializes the Express application by setting up middleware, view engine,
  // and routes. It takes an array of routers as input, which are mounted to
  // the app.
  private initApp(routers: SchedulingRouter[]): Application {
    const app = Express()
    this.initMiddleware(app)
    this.initViewEngine(app)
    this.initRoutes(app, routers)
    return app
  }

  // Initializes middleware for the Express app. It sets up JSON parsing for
  // incoming requests and serves static files from the 'static' directory. This
  // allows the app to handle JSON request bodies and serve assets like CSS and
  // JavaScript files.
  private initMiddleware(app: Application) {
    this.logger.info('Initializing Middleware')
    // Middleware to serve static files from the provided directory
    const staticDir = this.staticDir()
    this.logger.info(`Serving Static Files From ${staticDir}`)
    app.use(Express.static(staticDir))
  }

  // Initializes the view engine for the Express app. It sets EJS as the view
  // engine and configures the directory where the EJS templates are located.
  // This allows the app to render dynamic HTML pages using EJS templates.
  private initViewEngine(app: Application) {
    this.logger.info('Setting Up View Engine')
    app.set('view engine', 'ejs')
    app.set('views', this.viewsDir())
  }

  // Initializes the routes for the Express app. It adds a health check route
  // and a root route for rendering the starting view. It also mounts any
  // additional routers provided as input to the app. This allows the app to
  // handle various HTTP requests and serve the appropriate responses based on
  // the defined routes.
  private initRoutes(app: Application, routers: SchedulingRouter[]) {
    // Add health route
    app.get('/health', (_req: any, res: any) => res.json({ ok: true }))

    // Add root view route
    app.get('/', (_req: any, res: any) => res.render('index'))

    // Mount provided routers
    const length = routers.length
    this.logger.info(`Mounting ${length} Routers`)
    routers.forEach((router, index) => {
      this.logger.info(`Mounting Router ${index + 1}`)
      const expressRouter = router.getRouter()
      this.logRoutes(expressRouter)
      app.use(expressRouter)
    })
  }

  logRoutes(router: Router) {
    for (const layer of router.stack) {
      if (layer.route) {
        const methodMap = (layer.route as any).methods
        const methods: string[] = []
        for (const method of Object.keys(methodMap)) {
          methods.push(method.toUpperCase())
        }
        const path = layer.route.path
        this.logger.info(` -- ${methods.join(', ')} ${path}`)
      }
    }
  }

  start(port: number) {
    this.app.listen(port, () => {
      this.logger.info(`SchedulingWebServer Started on Port ${port}`)
      this.logger.info(`Visit http://localhost:${port} in Your Browser`)
    })
  }
}
