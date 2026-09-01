import { ZodObject, ZodRawShape } from "zod";
import { Request, Response, NextFunction } from "express";

interface Schemas {
  body?: ZodObject<ZodRawShape>;
  params?: ZodObject<ZodRawShape>;
  query?: ZodObject<ZodRawShape>;
}

/**
 * Generic Zod validation middleware factory.
 * Validates req.body, req.params, and req.query against provided schemas.
 * On success, attaches parsed results to req.validatedBody, req.validatedParams,
 * and req.validatedQuery respectively.
 * On failure, returns a 400 response with Zod's flattened error structure.
 */
export const validate =
  (schemas: Schemas) =>
    (req: Request, res: Response, next: NextFunction): void => {
      try {
        const targets = [
          { schema: schemas.body, source: req.body, dest: "validatedBody" },
          { schema: schemas.params, source: req.params, dest: "validatedParams" },
          { schema: schemas.query, source: req.query, dest: "validatedQuery" },
        ] as const;

        for (const { schema, source, dest } of targets) {
          if (!schema) continue;
          const result = schema.safeParse(source);
          if (!result.success) {
            res.status(400).json({ success: false, errors: formatZodErrors(result.error.flatten()) });
            return;
          }
          (req as unknown as Record<string, unknown>)[dest] = result.data;
        }

        next();
      } catch (err) {
        next(err);
      }
    };


function formatZodErrors(flattened: { formErrors: string[]; fieldErrors: Record<string, string[] | undefined> }) {
  const errors: Record<string, string> = {};

  for (const [field, messages] of Object.entries(flattened.fieldErrors)) {
    if (messages && messages.length > 0) {
      errors[field] = messages[0]; // just take the first message per field
    }
  }

  if (flattened.formErrors.length > 0) {
    errors["_form"] = flattened.formErrors[0];
  }

  return errors;
}