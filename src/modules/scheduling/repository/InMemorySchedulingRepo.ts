import ISchedulingRepository from "./ISchedulingRepository";
import IEvent from "../model/IEvent";
import IAvailability from "../model/IAvailability";
import crypto from "crypto";

// IN-MEMORY REPOSITORY IMPLEMENTATION ///////////////////////////////////////
// This is an in memory implementation of the scheduling repository
// It is used as the initial implementation of the repository
// and as a reference for the database schema. It will allow us to
// test the application without a database at first.
/////////////////////////////////////////////////////////////////////////////

export class InMemorySchedulingRepo implements ISchedulingRepository {
  private events: Map<string, IEvent> = new Map();
  private availabilities: Map<string, IAvailability[]> = new Map();

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

  async upsertAvailability(args: {
    eventId: string;
    userId: string;
    availableStart: Date;
    availableEnd: Date;
    note?: string;
  }): Promise<IAvailability> {
    const availabilitiesForEvent = this.availabilities.get(args.eventId) || [];
    let availability = availabilitiesForEvent.find(
      (a) => a.userId === args.userId,
    );

    if (availability) {
      availability.availableStart = args.availableStart;
      availability.availableEnd = args.availableEnd;
      availability.note = args.note;
    } else {
      availability = {
        id: crypto.randomUUID(),
        eventId: args.eventId,
        userId: args.userId,
        availableStart: args.availableStart,
        availableEnd: args.availableEnd,
        note: args.note,
        createdAt: new Date(),
      };
      availabilitiesForEvent.push(availability);
      this.availabilities.set(args.eventId, availabilitiesForEvent);
    }

    return availability;
  }

  async listAvailability(eventId: string): Promise<IAvailability[]> {
    return this.availabilities.get(eventId) || [];
  }

  async reset(): Promise<void> {
    this.events.clear();
    this.availabilities.clear();
  }
}
