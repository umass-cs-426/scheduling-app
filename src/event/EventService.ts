import { Event } from "./Event";
import { IEventRepository } from "./EventRepository";
import { IEventLookup } from "./EventLookup";

export interface IEventService {
  createEvent(title: string, date: string): Event;
  listEvents(): Event[];
}

export class EventService implements IEventService, IEventLookup {
  constructor(private repo: IEventRepository) {}

  createEvent(title: string, date: string): Event {
    const event: Event = {
      id: crypto.randomUUID(),
      title,
      date,
    };
    this.repo.save(event);
    return event;
  }

  listEvents(): Event[] {
    return this.repo.findAll();
  }

  exists(eventId: string): boolean {
    return this.repo.findAll().some((e: Event) => e.id === eventId);
  }
}
