// This module defines the Logger interface and a ConsoleLogger implementation.

// The Logger interface defines the methods that any logger implementation must
// provide. This allows us to abstract away the logging mechanism and use
// different loggers in different parts of the application without having to
// change the code that uses the logger.
export interface Logger {
  info: (message: string) => void
  warn: (message: string) => void
  error: (message: string) => void
}

// The prefix function generates a log message prefix that includes a timestamp
// and the log level. This helps to provide context for log messages and makes
// it easier to read and understand the logs.
function prefix(level: 'INFO' | 'WARN' | 'ERROR'): string {
  const timestamp = new Date().toISOString()
  return `${timestamp} ${level}:`
}

// The ConsoleLogger is a simple implementation of the Logger interface that
// uses the console to log messages. This is a basic implementation for
// demonstration purposes, and it can be replaced with a more robust
// implementation (e.g., using a logging library) in the future.
class ConsoleLogger implements Logger {
  info(message: string): void {
    console.log(`${prefix('INFO')} ${message}`)
  }

  warn(message: string): void {
    console.warn(`${prefix('WARN')} ${message}`)
  }

  error(message: string): void {
    console.error(`${prefix('ERROR')} ${message}`)
  }
}

// The LoggerType type is a discriminated union that represents the different
// types of loggers that can be created. This allows us to easily add new logger
// types in the future by simply adding new cases to the union and handling
// them in the Logger factory function.
export type LoggerType = { kind: 'ConsoleLogger' }

// The Logger function is a factory function that creates a logger based on the
// specified LoggerType. It uses a switch statement to determine which logger to
// create based on the kind property of the LoggerType. If an unknown logger
// type is provided, it throws an error.
function Logger(logger: LoggerType): Logger {
  switch (logger.kind) {
    case 'ConsoleLogger':
      return new ConsoleLogger()
    default:
      // This is a type guard to ensure that all cases are handled. If we add
      // new logger types in the future and forget to handle them here,
      // TypeScript will give us an error. This is a valid example of throwing
      // an exception in TypeScript, as it indicates a programming error that
      // should be fixed during development.
      throw new Error(`Unknown logger type: ${logger.kind}`)
  }
}

export default Logger
