import { Router } from "express";
import SchedulingController from "../controller/SchedulingController";
import { asyncHandler } from "../../../lib/http";

export default class SchedulingRoutesBuilder {
    static build(controller: SchedulingController): Router {
        const router = Router();

        // Bind controllers to router
        // This is a common pattern when using classes with Express. 
        // It ensures that `this` inside the controller methods refers to the controller instance.
        const createEventHandler = controller.createEvent.bind(controller);
        const submitAvailabilityHandler = controller.submitAvailability.bind(controller);
        const listAvailabilityHandler = controller.listAvailability.bind(controller);
        const resetHandler = controller.reset.bind(controller);

        // Register routes
        router.post("/events", asyncHandler(createEventHandler));
        router.post("/events/:eventId/availability", asyncHandler(submitAvailabilityHandler));
        router.get("/events/:eventId/availability", asyncHandler(listAvailabilityHandler));
        router.post("/reset", asyncHandler(resetHandler));

        return router;
    }
}
