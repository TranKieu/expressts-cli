import { HttpError } from './http-error';

export class BadRequest extends HttpError {
  name = 'BadRequestError';
  status = 400;
  constructor(request?: string) {
    super();
    Object.setPrototypeOf(this, BadRequest.prototype);
    this.message = `Request ${request} has wrong format!`;
  }
}
