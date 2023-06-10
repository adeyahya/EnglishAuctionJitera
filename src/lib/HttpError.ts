class HttpError {
  public statusCode: number;
  public errors: object;
  constructor(message = "Bad Request", statusCode = 400) {
    this.statusCode = statusCode;
    this.errors = { message };
  }
}

export const ErrorUnauthorized = new HttpError("Not Authorized", 401);
export const ErrorNegativeAmount = new HttpError(
  "Amount of money should greater than zero",
  400
);

export default HttpError;
