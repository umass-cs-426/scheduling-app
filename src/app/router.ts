import express, { type Express, type NextFunction, type Request, type Response } from "express";
import { ApiError } from "../lib/error";
import SchedulingRoutesBuilder from "../modules/scheduling/routes/SchedulingRoutesBuilder";
import SchedulingController from "../modules/scheduling/controller/SchedulingController";

// This is the main application class.
// It is responsible for setting up the Express app and routing. The setup of the 
// application is done in the constructor and follows this step-by-step process:
//
// 1. Initialize the Express app
// 2. Add common middleware
// 3. Add routes
// 4. Add error handlers
//
// The constructor takes an object with dependencies (in this case, the scheduling controller).
// This is a common pattern in code called dependency injection or inversion of control, which 
// makes the code more testable.
//
// The `getExpress()` method is provided to allow the server to access the underlying Express app.
// This is useful for starting the server and for testing.
export class AppRouter {
    private readonly expressApp: Express;

    constructor(args: { schedulingController: SchedulingController }) {
        // 1. Initialize the Express app
        this.expressApp = express();

        // 2. Common middleware
        this.expressApp.use(express.json());

        // 3. Routes
        // Health check - this is used to check if the server is running. We will see this
        // more later when we look at microservices and containerization. In this case, we
        // are just returning a simple JSON object. However, in a production system, you
        // would want to include more information such as the version of the application,
        // the number of requests processed, etc.
        this.expressApp.get("/health", (_req, res) => res.json({ ok: true }));

        // Scheduling API routes
        this.expressApp.use("/api", SchedulingRoutesBuilder.build(args.schedulingController));

        // 4. Error handlers

        // Not found handler
        // This is a catch-all route that will be called if no other route matches.
        this.expressApp.use((_req, res) => {
            res.status(404).json({ error: { code: "NOT_FOUND", message: "Route not found" } });
        });

        // Error handler (must have 4 args in Express)
        // This is a catch-all error handler that will be called if no other error handler matches.
        this.expressApp.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
            if (error instanceof ApiError) {
                res.status(error.status).json({
                    error: {
                        code: error.code,
                        message: error.message,
                        details: error.details ?? null
                    }
                }
                );
                return;
            }

            // In production you would not leak error details.
            res.status(500).json({
                error: {
                    code: "INTERNAL_ERROR",
                    message: "Unexpected error",
                    details: String(error)
                }
            }
            );
        });
    }

    // Expose the underlying Express instance for server.ts and tests.
    getExpress(): Express {
        return this.expressApp;
    }
}
