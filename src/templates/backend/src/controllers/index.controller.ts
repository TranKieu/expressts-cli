import { Controller } from './controller';
import { HttpServer } from '../server/http-server';
import { Request, Response, NextFunction } from 'express';
import {
  log,
  logWithPar
} from '../middlewares/log.middleware';
import { Environment } from '../environment';

export class IndexController implements Controller {
  //private path = `${Environment.getVersion()}/`;
  private path = `/`;

  /**
   * Khai báo các Routes ở đây
   * @param http : ExpressServer
   *
   * RequestHandler tương ứng với route sẽ được gọi:
   *  + Ko có Argument vs bind: this.nameFunk.bind(this)
   *  + vs Argument vs call: call.nameFunk.call(this, par...)
   *    => vì call sẽ thực thi ngay và trả lại function dc Return
   *
   *  - this trong bind là chính nó chứ ko phải là class này.
   */
  init(http: HttpServer) {
    // Với Middleware = RequestHandler
    http.get(
      this.path,
      log.bind(this),
      logWithPar.call(this, 'Parameter'),
      this.showIndex.bind(this)
    );

    // chỉ có Callback
    http.get(`${this.path}/index`, this.get.bind(this));
  }

  /*Tạo các ReuquestHandler tương ứng */

  /** => Nguyên tắc xử lý Request:
   *
   * + Validate đầu vào tại Controller
   * + Validate Entity tại Service
   * + Xử lý Error tại Controller vs next
   * + Throw Error tại Service => chú ý loại lỗi
   */

  private async showIndex(
    req: Request,
    res: Response
  ): Promise<void> {
    // để test server bằng browser
    let inhalt = 'RUN';
    res.send(inhalt);
  }

  // nếu muốn test template
  private async get(
    req: Request,
    res: Response
  ): Promise<void> {
    res.render('index', { title: 'Hallo' });
  }
}
