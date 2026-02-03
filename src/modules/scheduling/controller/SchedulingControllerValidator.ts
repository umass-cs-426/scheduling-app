import { z } from "zod";

// We accept ISO date strings from HTTP and convert them later.
// Zod can validate structure, then we can do additional logic checks in service.

export default class SchedulingControllerValidator {
    static createEventSchema = z.object({
        title: z.string().min(1).max(200),
        timezone: z.string().min(1).max(100),
        startsAt: z.iso.datetime(),
        endsAt: z.iso.datetime()
    });

    static submitAvailabilitySchema = z.object({
        userId: z.string().min(1).max(200),
        availableStart: z.iso.datetime(),
        availableEnd: z.iso.datetime(),
        note: z.string().max(500).optional()
    });

    static eventIdSchema = z.string().min(1).max(200);
}
