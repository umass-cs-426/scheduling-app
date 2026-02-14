import { Router } from 'express'

// The SchedulingRouter interface defines a contract for any router that will
// be used in the scheduling application. It requires implementing a method
// getRouter() that returns an Express Router instance.
export interface SchedulingRouter {
  getRouter(): Router
}
