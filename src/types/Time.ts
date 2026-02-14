// Time Type
//
// The Time type represents a specific time of day in a 24-hour format. It is
// defined as an object with two properties: hours and minutes. This type is
// useful for representing times in a consistent way throughout the codebase,
// allowing for easier manipulation and formatting of time values.
//
import { Result, Ok, Err } from './Result'

// A Time type is an object with hours and minutes properties, both of which
// are numbers. The hours property represents the hour of the day (0-23), while
// the minutes property represents the minute of the hour (0-59).
export type Time = { hours: number; minutes: number }

// Validate two-digit strings
// Returns true if the string consists of exactly two digits (0-9); false
// otherwise.
const isTwoDigits = (s: string) => /^\d{2}$/.test(s)

// Time object with helper method to create Time instances from strings
export const Time = {
  of(timestr: string): Result<Time, string> {
    const [hoursStr, minutesStr] = timestr.split(':')
    if (!isTwoDigits(hoursStr) || !isTwoDigits(minutesStr)) {
      return Err(`Invalid time string: ${timestr}`)
    }

    const hours = parseInt(hoursStr, 10)
    const minutes = parseInt(minutesStr, 10)
    if (
      isNaN(hours) ||
      isNaN(minutes) ||
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59
    ) {
      return Err(`Invalid time string: ${timestr}`)
    }
    return Ok({ hours, minutes })
  },
}

// Default export for convenience
// We export the Time object as the default export of this module, allowing
// users to import it directly without needing to use named imports. This can
// be particularly useful in cases where the Time object is the primary export
// of the module, making it easier to use in other parts of the codebase,
// especially if the other types are not needed.
export default Time
