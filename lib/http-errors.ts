export class RequestError extends Error {
  statusCode: number;
  errors?: Record<string, string[]>;

  constructor(
    statusCode: number,
    message: string,
    errors?: Record<string, string[]>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.name = "RequestError";
  }
}

export class ValidationError extends RequestError {
  constructor(fieldErrors: Record<string, string[]>) {
    const messsage = ValidationError.formatFieldErrors(fieldErrors);
    super(400, messsage, fieldErrors);
    this.name = "validationError";
    this.errors = fieldErrors;
  }
  static formatFieldErrors(errors: Record<string, string[]>): string {
    const formattedErrors = Object.entries(errors).map(([field, messages]) => {
      const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
      if (messages[0] === "Required") {
        return `${fieldName} is required`;
      } else {
        return messages.join("and");
      }
    });
    return formattedErrors.join(", ");
  }
}

export class NotFoundError extends RequestError {
  constructor(resourse: string) {
    super(404, `${resourse} not found`);
    this.name = "NotFoundError";
  }
}

export class ForbiddenError extends RequestError {
  constructor(message: string) {
    super(403, `${message} not found`);
    this.name = "ForbiddenError";
  }
}

export class UnauthorhorizedError extends RequestError {
  constructor(message: string) {
    super(401, `${message} not found`);
    this.name = "UnauthorhorizedError";
  }
}
