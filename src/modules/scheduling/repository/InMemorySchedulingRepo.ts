import ISchedulingRepository from "./ISchedulingRepository";
import IEvent from "../model/IEvent";
import crypto from "crypto";

// IN-MEMORY REPOSITORY IMPLEMENTATION ///////////////////////////////////////
// This is an in memory implementation of the scheduling repository
// It is used as the initial implementation of the repository
// and as a reference for the database schema. It will allow us to
// test the application without a database at first.
/////////////////////////////////////////////////////////////////////////////

export class InMemorySchedulingRepo implements ISchedulingRepository {
  private events: Map<string, IEvent> = new Map();

  async createEvent(args: {
    title: string;
    timezone: string;
    startsAt: Date;
    endsAt: Date;
  }): Promise<IEvent> {
    const event: IEvent = {
      id: crypto.randomUUID(),
      title: args.title,
      timezone: args.timezone,
      startsAt: args.startsAt,
      endsAt: args.endsAt,
      createdAt: new Date(),
    };
    this.events.set(event.id, event);
    return event;
  }

  async getEventById(eventId: string): Promise<IEvent | null> {
    return this.events.get(eventId) || null;
  }

  async listEvents(): Promise<IEvent[]> {
    return Array.from(this.events.values());
  }

  async reset(): Promise<void> {
    this.events.clear();
  }
}
