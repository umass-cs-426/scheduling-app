import IEvent from "../model/IEvent";
import IAvailability from "../model/IAvailability";

// In OO terms, this is our "data access interface".
// The service depends on this interface, not on Prisma directly.
export default interface ISchedulingRepository {
    createEvent(args: { title: string; timezone: string; startsAt: Date; endsAt: Date }): Promise<IEvent>;

    getEventById(eventId: string): Promise<IEvent | null>;

    // Upsert means: if the user already submitted availability for this event, we update it.
    // This makes the route deterministic.
    upsertAvailability(args: {
        eventId: string;
        userId: string;
        availableStart: Date;
        availableEnd: Date;
        note?: string;
    }): Promise<IAvailability>;

    // List availability for a specific event.
    listAvailability(eventId: string): Promise<IAvailability[]>;

    // Reset the repository for testing.
    reset(): Promise<void>;
}
