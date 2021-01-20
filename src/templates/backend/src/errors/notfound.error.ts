import { HttpError } from './http-error';

export class NotFound extends HttpError {
  name = 'ResourceNotFoundError';
  status = 404;
  constructor(resource: string) {
    super();
    Object.setPrototypeOf(this, NotFound.prototype);

    this.message = `${resource} does not exist !`;
  }
}
