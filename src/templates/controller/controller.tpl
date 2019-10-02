import { Controller } from './Controller';
import { HttpServer } from '../server/HttpServer';
import { Response, Request, NextFunction } from 'express';
import { MethodNotAllowed } from '../errors/methodnotallowed.error';
import { Environment } from '../environment';

// Import Service

export class RESOURCEController implements Controller {

  private router = Environment.getVersion() + '/RESRCURI';

  init(httpServer: HttpServer): void {

    // Read Alle 
    httpServer.get(`${this.router}`, this.getAll.bind(this));

    // Read One = id
    httpServer.get(`${this.router}/:id`, this.getById.bind(this));

    // Create new 
    httpServer.post(`${this.router}`, this.create.bind(this));

    // Update One = id
    httpServer.put(`${this.router}/:id`, this.update.bind(this));

    // delete One = id
    httpServer.delete(`${this.router}/:id`, this.remove.bind(this));

    // delete Alle 
    httpServer.delete(`${this.router}`, this.removeAll.bind(this));
  }

  /** Các bước thực hiện:
   *   + Kiểm tra dữ liệu đầu vào
   *   + lấy dữ liệu từ Service vs dữ liệu => trycatch
   *   + gửi về Client Data oder next(Exception)
   */

  private async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    /**
     *  res.json(await Service.getAll());
     */

    let url = req.method + req.url;
    next(new MethodNotAllowed(url));
  }

  private async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {

    /**
     * Service.getById(+req.params.id)
     */
    let url = req.method + req.url;
    next(new MethodNotAllowed(url));
  }

  private async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    /**
     * await Service.create(new);
     */
    let url = req.method + req.url;
    next(new MethodNotAllowed(url));
  }

  private async update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    /**
     * await Service.update({ })
     */
    let url = req.method + req.url;
    next(new MethodNotAllowed(url));
  }

  private async remove(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    /**
     * await Service.remove(+req.params.id)
     */
    let url = req.method + req.url;
    next(new MethodNotAllowed(url));
  }

  private async removeAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    /**
     * await Service.deleteALL()
     */
    let url = req.method + req.url;
    next(new MethodNotAllowed(url));
  }
}