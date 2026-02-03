// EventDTO is the shape of the data we send to the client
// We use this to enforce consistency between the service and controller
export default interface IEventDTO {
    id: string;
    title: string;
    timezone: string;
    startsAt: string; // ISO string for HTTP responses
    endsAt: string;   // ISO string for HTTP responses
    createdAt: string;
}