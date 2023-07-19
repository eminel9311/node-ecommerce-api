import { Response } from 'express';
import { HttpStatusCode } from '../httpStatusCode/httpStatusCode';

interface responseProperty {
  message: string;
  statusCode?: number;
  reasonStatusCode?: string;
  metadata: object;
  options?: object;
}

class SuccessResponse {
  message: string;
  status: number;
  metadata: object;
  constructor({
    message,
    statusCode = HttpStatusCode.StatusCodes.OK,
    reasonStatusCode = HttpStatusCode.ReasonPhrases.OK,
    metadata = {},
  }: responseProperty) {
    this.message = !message ? reasonStatusCode : message;
    this.status = statusCode;
    this.metadata = metadata;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  send(res: Response, _headers = {}) {
    return res.status(this.status).json(this);
  }
}

class OK extends SuccessResponse {
  constructor({ message, metadata }: responseProperty) {
    super({ message, metadata });
  }
}

class CREATED extends SuccessResponse {
  options: object;
  constructor({
    options={},
    message,
    statusCode = HttpStatusCode.StatusCodes.CREATED,
    reasonStatusCode = HttpStatusCode.ReasonPhrases.CREATED,
    metadata = {},
  }: responseProperty) {
    super({ message, statusCode, reasonStatusCode, metadata });
    this.options = options;
  }
}

export { OK, CREATED };
