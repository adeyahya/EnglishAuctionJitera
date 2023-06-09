class HttpError {
  public statusCode: number;
  public errors: object;
  constructor(message = "Bad Request", statusCode = 400) {
    this.statusCode = statusCode;
    this.errors = { message };
  }
}

export default HttpError;
