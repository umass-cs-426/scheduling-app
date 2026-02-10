import IEvent from "../model/IEvent";

// In OO terms, this is our "data access interface".
// The service depends on this interface, not on Prisma directly.
export default interface ISchedulingRepository {
    createEvent(args: { title: string; timezone: string; startsAt: Date; endsAt: Date }): Promise<IEvent>;

    getEventById(eventId: string): Promise<IEvent | null>;

    listEvents(): Promise<IEvent[]>;

    // Reset the repository for testing.
    reset(): Promise<void>;
}
