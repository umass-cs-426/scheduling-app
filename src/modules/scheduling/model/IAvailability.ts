// Represents an availability in the scheduling system
// An Availability is a time period during which a user is available to attend an event.
export default interface IAvailability {
    id: string;
    eventId: string;
    userId: string;
    availableStart: Date;
    availableEnd: Date;
    note?: string;
    createdAt: Date;
}