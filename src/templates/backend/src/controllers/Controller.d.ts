import { HttpServer } from '../server/http-server';

export interface Controller {
  /**
   * Gắn tất cả các Route trong Controller
   * vào HttpServer
   */
  init(HttpServer: HttpServer): void;
}