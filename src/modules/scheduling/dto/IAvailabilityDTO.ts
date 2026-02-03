// AvailabilityDTO is the shape of the data we send to the client
// We use this to enforce consistency between the service and controller
export default interface IAvailabilityDTO {
    id: string;
    eventId: string;
    userId: string;
    availableStart: string; // ISO
    availableEnd: string;   // ISO
    note: string | null;
    createdAt: string;
}