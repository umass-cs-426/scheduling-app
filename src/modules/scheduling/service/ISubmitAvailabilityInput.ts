// ISubmitAvailabilityInput is the shape of the data we accept from the client
// We use this to enforce consistency between the service and controller
export default interface ISubmitAvailabilityInput {
    userId: string;
    availableStart: string; // ISO
    availableEnd: string;   // ISO
    note?: string;
}