// This is the public interface for the Availability module. It defines the
// types and functions that are exposed to other modules in the application.

export interface AvailabilityPort {
  // Currently, we do not expose any functionality.
}

class LocalAvailabilityPort implements AvailabilityPort {
  constructor() {}
}

export default function AvailabilityPort(): AvailabilityPort {
  return new LocalAvailabilityPort()
}
