export class HttpError extends Error {
  name = 'HttpError';
  status = 500;
  message = 'something wrong!';
  constructor() {
    super();
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

/*
export class Some extends HttpError {
    name = "SomeError";
    status = 500; // Status http Code

    constructor(propertyPath: string) {
        super();
        Object.setPrototypeOf(this, EntityColumnNotFound.prototype);
        // Tạo message bằng constructor
        this.message = `No entity column "${propertyPath}" was found.`;
    }
}
*/
