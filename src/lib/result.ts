// A tiny Result type, like Rust or many FP libraries.
// We use it so we can return success or failure without throwing.
export interface Ok<T> {
    ok: true;
    value: T;
}

export interface Err<E> {
    ok: false;
    error: E;
}

export type Result<T, E> = Ok<T> | Err<E>;

export function ok<T>(value: T): Ok<T> {
    return { ok: true, value };
}

export function err<E>(error: E): Err<E> {
    return { ok: false, error };
}

export function isOk<T, E>(r: Result<T, E>): r is Ok<T> {
    return r.ok;
}

export function isErr<T, E>(r: Result<T, E>): r is Err<E> {
    return !r.ok;
}
