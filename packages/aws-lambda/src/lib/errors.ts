import {HttpStatusCode} from "./http-status-code";

export class ValidationError extends Error {

  readonly statusCode = HttpStatusCode.BAD_REQUEST;

  constructor(message?: string) {
    super(message ?? "Validation error");
    this.name = "ValidationError";
  }
}

export class NotFoundError extends Error {

  readonly statusCode = HttpStatusCode.NOT_FOUND;

  constructor(message?: string) {
    super(message ?? "Not found");
    this.name = "NotFoundError";
  }
}

export class ForbiddenError extends Error {

  readonly statusCode = HttpStatusCode.FORBIDDEN;

  constructor(message?: string) {
    super(message ?? "Forbidden");
    this.name = "ForbiddenError";
  }
}
