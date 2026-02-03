export type ApiErrorCode =
    | "VALIDATION_ERROR"
    | "NOT_FOUND"
    | "CONFLICT"
    | "INTERNAL_ERROR";

export class ApiError extends Error {
    public readonly code: ApiErrorCode;
    public readonly status: number;
    public readonly details?: unknown;

    constructor(args: { code: ApiErrorCode; status: number; message: string; details?: unknown }) {
        super(args.message);
        this.code = args.code;
        this.status = args.status;
        this.details = args.details;
    }

    static validation(message: string, details?: unknown): ApiError {
        return new ApiError({ code: "VALIDATION_ERROR", status: 400, message, details });
    }

    static notFound(message: string): ApiError {
        return new ApiError({ code: "NOT_FOUND", status: 404, message });
    }

    static conflict(message: string): ApiError {
        return new ApiError({ code: "CONFLICT", status: 409, message });
    }

    static internal(message = "Internal error", details?: unknown): ApiError {
        return new ApiError({ code: "INTERNAL_ERROR", status: 500, message, details });
    }
}
