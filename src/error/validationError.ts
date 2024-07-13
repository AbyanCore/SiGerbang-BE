import customError from "./customError";

class validationError extends customError {
  errorCode: number = 400;
  errorType: string = "VALIDATION_ERROR";

  constructor(message: string, public field: string) {
    super(message);

    Object.setPrototypeOf(this, validationError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message, field: this.field }];
  }
}

export default validationError;
