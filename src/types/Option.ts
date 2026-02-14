// Some Type
//
// The Some type is a common pattern in functional programming to represent a
// value that may or may not be present. It is often used in conjunction with
// the None type to represent optional values in a type-safe way. This allows
// us to handle cases where a value may be missing without resorting to null or
// undefined, which can lead to safer and more maintainable code.
//
export type None = { kind: 'none' }
export type Some<T> = { kind: 'some'; value: T }

// The Option type is a discriminating union of None and Some, allowing us to
// represent either the presence or absence of a value in a type-safe way. This
// is particularly useful for functions that may not always return a value, as
// it forces the caller to handle the case where the value is missing
// explicitly.
export type Option<T> = None | Some<T>

// Helper functions to create None and Some options, making it easier to work
// with the Option type in the codebase. These functions provide a clear and
// concise way to create Option instances, improving readability and
// maintainability.
export const None: Option<never> = { kind: 'none' }
export const Some = <T>(value: T): Option<T> => ({ kind: 'some', value })
