abstract class customError extends Error {
  abstract errorCode: number;
  abstract errorType: string;
  abstract serializeErrors(): { message: string; field?: string }[];

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, customError.prototype);
  }
}

export default customError;
