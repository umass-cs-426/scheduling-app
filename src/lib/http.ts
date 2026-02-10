import type { NextFunction, Request, Response } from "express";
import { ApiError } from "./error";
import type { Result } from "./result";

// Express does not automatically catch rejected promises.
// This wrapper makes async route handlers safe.
export function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

// Sends a Result to the client.
// If the Result is an Ok, sends the value with the given successStatus (default 200).
// If the Result is an Err, sends the error as a JSON object with the error's status.
export function sendResult<T>(res: Response, result: Result<T, ApiError>, successStatus = 200): void {
    if (result.ok) {
        res.status(successStatus).json(result.value);
        return;
    }

    const e = result.error;
    res.status(e.status).json({
        error: {
            code: e.code,
            message: e.message,
            details: e.details ?? null
        }
    });
}

// Render a template if Ok, otherwise return a JSON error payload.
export function renderResult<T>(
    res: Response,
    result: Result<T, ApiError>,
    view: string,
    locals: Record<string, unknown> = {},
    successStatus = 200
): void {
    if (result.ok) {
        const data = Array.isArray(result.value)
            ? { events: result.value }
            : { event: result.value };
        res.status(successStatus).render(view, { ...locals, ...data });
        return;
    }

    const e = result.error;
    res.status(e.status).json({
        error: {
            code: e.code,
            message: e.message,
            details: e.details ?? null
        }
    });
}
