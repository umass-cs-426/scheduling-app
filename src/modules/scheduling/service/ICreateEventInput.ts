// ICreateEventInput is the shape of the data we accept from the client
// We use this to enforce consistency between the service and controller
export default interface ICreateEventInput {
    title: string;
    timezone: string;
    startsAt: string; // ISO
    endsAt: string;   // ISO
}
