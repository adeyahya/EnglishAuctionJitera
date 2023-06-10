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
export const ErrorInvalidAuctionState = new HttpError(
  "Auction state invalid",
  400
);
export const ErrorInvalidBid = new HttpError("Invalid bid", 400);
export const ErrorNotEnoughBalance = new HttpError("Not enough balance", 400);
export const ErrorInsufficientOffer = new HttpError("Insufficient offer", 400);
export const ErrorInvalidDelay = new HttpError("Too Fast!", 400);

export default HttpError;
