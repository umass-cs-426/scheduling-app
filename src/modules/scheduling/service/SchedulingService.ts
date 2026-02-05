import type ISchedulingRepository from "../repository/ISchedulingRepository";
import { ApiError } from "../../../lib/error";
import { Result, err, ok } from "../../../lib/result";
import ICreateEventInput from "./ICreateEventInput";
import ISubmitAvailabilityInput from "./ISubmitAvailabilityInput";
import IEventDTO from "../dto/IEventDTO";
import IAvailabilityDTO from "../dto/IAvailabilityDTO";

export interface ISchedulingService {
    createEvent(input: ICreateEventInput): Promise<Result<IEventDTO, ApiError>>;
    submitAvailability(eventId: string, input: ISubmitAvailabilityInput): Promise<Result<IAvailabilityDTO, ApiError>>;
    listAvailability(eventId: string): Promise<Result<{ event: IEventDTO; availability: IAvailabilityDTO[] }, ApiError>>;
    reset(): Promise<Result<void, ApiError>>;
}

export default class SchedulingService implements ISchedulingService {
    private readonly repo: ISchedulingRepository;

    constructor(repo: ISchedulingRepository) {
        this.repo = repo;
    }

    async createEvent(input: ICreateEventInput): Promise<Result<IEventDTO, ApiError>> {
        const startsAt = new Date(input.startsAt);
        const endsAt = new Date(input.endsAt);

        // "Time is simple" is a lie we will later fix. Here we still validate basic sanity.
        if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime())) {
            return err(ApiError.validation("startsAt and endsAt must be valid ISO datetimes"));
        }
        if (endsAt <= startsAt) {
            return err(ApiError.validation("endsAt must be after startsAt"));
        }

        const event = await this.repo.createEvent({
            title: input.title,
            timezone: input.timezone,
            startsAt,
            endsAt
        });

        return ok(this.toEventDTO(event));
    }

    async submitAvailability(
        eventId: string,
        input: ISubmitAvailabilityInput
    ): Promise<Result<IAvailabilityDTO, ApiError>> {
        const event = await this.repo.getEventById(eventId);
        if (!event) return err(ApiError.notFound(`No event exists with id ${eventId}`));

        const start = new Date(input.availableStart);
        const end = new Date(input.availableEnd);

        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
            return err(ApiError.validation("availableStart and availableEnd must be valid ISO datetimes"));
        }
        if (end <= start) {
            return err(ApiError.validation("availableEnd must be after availableStart"));
        }

        // Here is an assumption worth discussing in class:
        // We allow availability outside the event window. You can tighten this later.
        // A stricter system would reject availability outside [event.startsAt, event.endsAt].
        const saved = await this.repo.upsertAvailability({
            eventId,
            userId: input.userId,
            availableStart: start,
            availableEnd: end,
            note: input.note,
        });

        return ok(this.toAvailabilityDTO(saved));
    }

    async listAvailability(eventId: string): Promise<Result<{ event: IEventDTO; availability: IAvailabilityDTO[] }, ApiError>> {
        const event = await this.repo.getEventById(eventId);
        if (!event) return err(ApiError.notFound(`No event exists with id ${eventId}`));

        const rows = await this.repo.listAvailability(eventId);

        return ok({
            event: this.toEventDTO(event),
            availability: rows.map((r) => this.toAvailabilityDTO(r))
        });
    }

    async reset(): Promise<Result<void, ApiError>> {
        await this.repo.reset();
        return ok(void 0);
    }

    private toEventDTO(event: { id: string; title: string; timezone: string; startsAt: Date; endsAt: Date; createdAt: Date }): IEventDTO {
        return {
            id: event.id,
            title: event.title,
            timezone: event.timezone,
            startsAt: event.startsAt.toISOString(),
            endsAt: event.endsAt.toISOString(),
            createdAt: event.createdAt.toISOString()
        };
    }

    private toAvailabilityDTO(row: {
        id: string;
        eventId: string;
        userId: string;
        availableStart: Date;
        availableEnd: Date;
        note?: string | null;
        createdAt: Date;
    }): IAvailabilityDTO {
        return {
            id: row.id,
            eventId: row.eventId,
            userId: row.userId,
            availableStart: row.availableStart.toISOString(),
            availableEnd: row.availableEnd.toISOString(),
            note: row.note ?? null,
            createdAt: row.createdAt.toISOString()
        };
    }
}
