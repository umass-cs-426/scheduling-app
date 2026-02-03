// Represents an event in the scheduling system
// An Event is something that can be scheduled, like a meeting or a class.
export default interface IEvent {
    id: string;
    title: string;
    timezone: string;
    startsAt: Date;
    endsAt: Date;
    createdAt: Date;
}