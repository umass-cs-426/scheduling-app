// Result Type
//
// The Result type is a common pattern in functional programming to represent
// a value that can either be a success (Ok) or an error (Err). It is a powerful
// way to handle errors *explicitly* without throwing exceptions, allowing for
// more explicit error handling in the code. This turns out to be very
// important for a scalable web system.
//
type Ok<T> = { ok: true; value: T }
type Err<E> = { ok: false; error: E }

// The Result type is a discriminating union of Ok and Err, allowing us to
// represent either a successful result or an error in a type-safe way.
export type Result<T, E> = Ok<T> | Err<E>

// Helper functions to create Ok and Err results, making it easier to work with
// the Result type in the codebase. These functions provide a clear and concise
// way to create Result instances, improving readability and maintainability.
export const Ok = <T>(value: T): Result<T, never> => ({ ok: true, value })
export const Err = <E>(error: E): Result<never, E> => ({ ok: false, error })

// FYI: Because of the way TypeScript's type system works, we can use the
// Result type without needing to explicitly define the Ok and Err types in
// most cases. The Result type itself is sufficient to represent both success
// and error cases, and the helper functions are just a convenient way to
// create instances of Result.

// It is also worth noting that the type `Ok<T>` and the variable `Ok` are in
// different namespaces (type vs value), so they do not conflict with each
// other. The same applies to `Err<E>` and `Err`. This allows us to use the
// same names for both the type and the helper function without any issues.
