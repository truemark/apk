/**
 * Checks if the given variable is a ValidationError.
 *
 * @param e the variable to check
 */
export function isValidationError(e?: any): e is ValidationError {
  return e && e.stack && e.message && e.name && e.name === "ValidationError";
}

/**
 * Thrown when a validation error occurs.
 */
export class ValidationError extends Error {
  constructor(message?: string) {
    super(message ?? "Validation error");
    this.name = "ValidationError";
  }
}
