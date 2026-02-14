// PortError is a small, structured error type for the module boundaries.
// This makes it easy to swap an in-process port for a networked one later.
export type PortError = {
  kind: 'PortError'
  message: string
  code?: string
  status?: number
  cause?: unknown
}

export function PortError(
  message: string,
  options: Partial<PortError> = {},
): PortError {
  return { kind: 'PortError', message, ...options }
}
