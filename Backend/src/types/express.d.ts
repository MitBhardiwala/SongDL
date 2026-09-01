/**
 * Augments the Express Request interface to support Zod-validated
 * request parts. Populated by the `validate()` middleware.
 * Controllers access these via `as` type casting.
 */
declare global {
  namespace Express {
    interface Request {
      validatedBody?: Record<string, unknown>;
      validatedParams?: Record<string, unknown>;
      validatedQuery?: Record<string, unknown>;
    }
  }
}

export {};
