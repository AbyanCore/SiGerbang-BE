import customError from "./customError";

class secureError extends customError {
  errorCode: number = 401;
  errorType: string = "SECURE_ERROR";
  serializeErrors(): { message: string; field?: string }[] {
    return [{ message: this.message, field: this.field }];
  }

  constructor(message: string, public field: string) {
    super(message);

    Object.setPrototypeOf(this, secureError.prototype);
  }
}

export default secureError;
