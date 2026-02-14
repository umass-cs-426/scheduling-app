# TYPESCRIPT GUIDE

This guide explains the TypeScript patterns we use in this repository. The
goal is not to cover all of TypeScript, but to help us read this codebase
confidently.

## Factory Functions (Why We Prefer Them Over `new`)

We often use factory functions instead of `new` and class constructors. A
factory function is a plain function that returns a typed object. This makes
the object shape explicit and keeps the call site simple.

We use factory functions for a few important reasons:

First, they make creation *easy to track*. When we see `CreateEventInputDto(...)`
or `ValidatedEventDto(...)`, we know exactly where an object was created and
what it represents. With `new`, it is common to construct objects all over the
codebase in slightly different ways, which makes it harder to follow the flow
or enforce consistent rules.

Second, factories let us control the creation process in **one place**. If we
want to add normalization, defaults, or validation later, we update the factory
and all call sites benefit. With `new`, we would need to add that logic in
every constructor call site or hide it behind a more complex class API.

Third, factories are easier to **test and mock**. A factory is just a function,
so it can be replaced, wrapped, or observed with less setup than a class. This
helps us keep tests small and focused.

Fourth, factories make the **module boundary** clearer. When a port or service
calls `CreateEventInputDto(...)`, it signals that we are creating a DTO at the
edge of the module. That signal is useful in a modular monolith because it
keeps the boundary obvious in the code.

Fifth, factories reduce the **mental overhead** of object creation. We do not
need to remember which classes require `new`, what constructors are available,
or what order parameters should be in. A small named factory is direct and
self‑documenting.

Finally, factories make it easier to evolve from a monolith to microservices.
When objects are created through small, explicit functions, it is simpler to
swap a local implementation for a networked one later, because the creation
points are already clear and consistent.

Example:

```
export function CreateEventInputDto(title: string, date: string) {
  return { title, date }
}
```

This pattern keeps our DTOs small and direct. It also makes it easy to add
validation or normalization at the boundary if we want to later.

### Why the Function Name Matches the Interface

In TypeScript we can export an interface and a function with the same name,
and it still works. This is because TypeScript has **two namespaces**:

- The *type* namespace (interfaces, types)
- The *value* namespace (functions, objects, classes at runtime)

An interface only exists at compile time, while a function exists at runtime.
So `interface CreateEventInputDto` and `function CreateEventInputDto(...)`
can live side‑by‑side without conflict. This pattern gives us a clean
“shape + constructor” pairing:

```
export interface CreateEventInputDto {
  title: string
  date: string
}

export function CreateEventInputDto(title: string, date: string) {
  return { title, date }
}
```

At the call site, we get a nice, readable factory:

```
const dto = CreateEventInputDto(title, date)
```

And at the type level, we get a clear definition of the shape.

## DTO Types

DTOs (Data Transfer Objects) define the shape of data that crosses boundaries.
We use them to mark *where* data came from and *what* we can assume about it.

For example:

- `CreateEventInputDto` means “raw input that still needs validation.”
- `ValidatedEventDto` means “checked and safe to store.”
- `CreateEventOutputDto` means “safe to return to callers.”

Even if these DTOs contain the same fields, their **type** tells us how the
data should be treated.

### Deeper Example: Same Data, Different Meaning

Consider these three DTOs:

```
export interface CreateEventInputDto {
  title: string
  date: string
}

export interface ValidatedEventDto {
  title: string
  date: string
}

export interface CreateEventOutputDto {
  event: Event
}
```

At runtime, `CreateEventInputDto` and `ValidatedEventDto` might look identical.
But the *type* tells us different things:

- Input DTO: raw, untrusted data from the edge.
- Validated DTO: checked and safe to use internally.
- Output DTO: the exact shape we promise to return to callers.

This is why we keep separate DTO types even if they share fields. The type
communicates intent and trust, which reduces mistakes and keeps the codebase
easier to understand.

### DTOs and Validation

The usual flow looks like this:

```
const input = CreateEventInputDto(title, date)  // raw input
const validated = validateEvent(input)          // returns ValidatedEventDto
const saved = repository.save(validated)        // safe to store
return CreateEventOutputDto(saved)              // safe to return
```

We could store raw data directly, but then we would lose the guarantee that it
was checked. DTOs make that guarantee explicit and visible in the types.

## Result Types

We use a `Result` type instead of throwing exceptions for normal control flow.
This makes success and failure explicit in the function signature.

A `Result<T, E>` is either:

- `Ok(value)` when the operation succeeds
- `Err(error)` when it fails

This keeps error handling visible and encourages us to think about the failure
path at the call site.

## Interfaces and Ports

Interfaces define boundaries. A Port is an interface that describes what a
module can do. The rest of the system only depends on that interface, not the
implementation.

This makes it easy to swap a local implementation for a networked one later.

## Type Narrowing

We often check types at runtime to keep the system safe:

```
if (typeof title !== 'string' || title.trim() === '') {
  // return a 400 error
}
```

These checks help us keep untrusted input out of the trusted parts of the
system, and they make the validation rules obvious when reading the code.

## Summary

The TypeScript patterns here are intentionally simple. They emphasize clarity,
explicit boundaries, and readable data flow. That is exactly what we want in a
codebase designed for learning and for future expansion.
