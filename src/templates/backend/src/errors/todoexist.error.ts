import { HttpError } from "./http-error";

export class TodoExist extends HttpError {
  name = "TodoExitsError";
  status = 409; // Conflict

  constructor(content: string) {
    super();
    Object.setPrototypeOf(this, TodoExist.prototype);
    this.message = `This Todo: "${content}" is already exists!`;
  }
}
