import { HttpServer } from '../server/http-server';

export interface Controller {
  init(HttpServer: HttpServer): void;
}
