import type { Request, Response } from "express";
import SchedulingService from "../service/SchedulingService";
import { ApiError } from "../../../lib/error";
import { sendResult } from "../../../lib/http";
import { err, ok } from "../../../lib/result";
import V from "./SchedulingControllerValidator";

export interface ISchedulingController {
    createEvent(req: Request, res: Response): Promise<void>;
    listEvents(req: Request, res: Response): Promise<void>;
    getEvent(req: Request, res: Response): Promise<void>;
    reset(req: Request, res: Response): Promise<void>;
}

export default class SchedulingController implements ISchedulingController {
    private readonly service: SchedulingService;

    constructor(service: SchedulingService) {
        this.service = service;
    }

    // In Express, handlers are just functions, but we keep them as methods
    // because it matches how many students think coming from Java or Python.
    async createEvent(req: Request, res: Response): Promise<void> {
        const parsed = V.createEventSchema.safeParse(req.body);
        if (!parsed.success) {
            sendResult(res, err(ApiError.validation("Invalid request body", parsed.error.flatten())), 400);
            return;
        }

        const result = await this.service.createEvent(parsed.data);
        sendResult(res, result, 201);
    }

    async listEvents(_req: Request, res: Response): Promise<void> {
        const result = await this.service.listEvents();
        sendResult(res, result, 200);
    }

    async getEvent(req: Request, res: Response): Promise<void> {
        if (!V.eventIdSchema.safeParse(req.params.eventId).success) {
            sendResult(res, err(ApiError.validation("Missing eventId")), 400);
            return;
        }

        const result = await this.service.getEvent(req.params.eventId as string);
        sendResult(res, result, 200);
    }

    async reset(req: Request, res: Response): Promise<void> {
        await this.service.reset();
        sendResult(res, ok({ message: "Reset successful" }), 200);
    }
}
