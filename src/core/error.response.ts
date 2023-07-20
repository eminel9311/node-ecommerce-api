import { HttpStatusCode } from '../utils';
class ErrorResponse extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(
    message = HttpStatusCode.ReasonPhrases.CONFLICT,
    StatusCode = HttpStatusCode.StatusCodes.CONFLICT
  ) {
    super(message, StatusCode);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message = HttpStatusCode.ReasonPhrases.BAD_REQUEST,
    StatusCode = HttpStatusCode.StatusCodes.BAD_REQUEST
  ) {
    super(message, StatusCode);
  }
}

class ForbindenRequestError extends ErrorResponse {
  constructor(
    message = HttpStatusCode.ReasonPhrases.FORBIDDEN,
    StatusCode = HttpStatusCode.StatusCodes.FORBIDDEN
  ) {
    super(message, StatusCode);
  }
}

class NotFoundRequestError extends ErrorResponse {
  constructor(
    message = HttpStatusCode.ReasonPhrases.NOT_FOUND,
    StatusCode = HttpStatusCode.StatusCodes.NOT_FOUND
  ) {
    super(message, StatusCode);
  }
}

class AuthFailureRequestError extends ErrorResponse {
  constructor(
    message = HttpStatusCode.ReasonPhrases.UNAUTHORIZED,
    StatusCode = HttpStatusCode.StatusCodes.UNAUTHORIZED
  ) {
    super(message, StatusCode);
  }
}

export {
  ErrorResponse,
  ConflictRequestError,
  BadRequestError,
  ForbindenRequestError,
  NotFoundRequestError,
  AuthFailureRequestError,
};
