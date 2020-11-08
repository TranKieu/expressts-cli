import { Controller } from "./controller";
import { HttpServer } from "../server/http-server";
import { Request, Response, NextFunction } from "express";
import { log, logWithPar } from "../middlewares/log.middleware";

// Viet ly thuyet vao day
export class IndexController implements Controller {
  //private router = '/v1' + '/users';
  // goi cac methode cua controller tai day
  init(http: HttpServer) {
    // `${this.router}/:id`
    http.get(
      "/",
      log.bind(this),
      logWithPar.call(this, "Par"),
      this.showIndex.bind(this)
    );
    //http.get('/', this.get.bind(this));
  }

  private async showIndex(req: Request, res: Response): Promise<void> {
    // để test server bằng browser
    let inhalt = "RUN";
    res.send(inhalt);
  }

  // nếu muốn test template
  private async get(req: Request, res: Response): Promise<void> {
    res.render("index", { title: "Hallo" });
  }
}
