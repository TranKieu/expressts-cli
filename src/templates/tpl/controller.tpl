import { Controller } from './controller.interface';
import { HttpServer } from '../server/http-server';
import { Response, Request, NextFunction } from 'express';
import { environment } from '../environment';

// Errors
import { MethodNotAllowed } from '../errors/methodnotallowed.error';

// Import Services


// Middelwares

// test middleware
import { log } from '../middlewares/log.middleware'; 

export class RESOURCEController implements Controller {

  // URL luôn là số nhiều
  private router = environment.API_URL + '/RESRCURI';

  init(httpServer: HttpServer): void {

    // Read Alle 
    httpServer.get(`${this.router}`, log.bind(this), this.getAll.bind(this));

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
    req: Request, res: Response, next: NextFunction
  ): Promise<void> {
    /**
     *  res.json(await Service.getAll());
     */

    next(new MethodNotAllowed(req.method + ' : ' + req.url));
  }

  private async getById(
    req: Request, res: Response, next: NextFunction
  ): Promise<void> {

    /**
     * Service.getById(+req.params.id)
     */
    next(new MethodNotAllowed(req.method + ' : ' + req.url));
  }

  private async create(
    req: Request, res: Response, next: NextFunction
  ): Promise<void> {
    /**
     * await Service.create(new);
     */
    next(new MethodNotAllowed(req.method + ' : ' + req.url));
  }

  private async update(
    req: Request, res: Response, next: NextFunction
  ): Promise<void> {
    /**
     * await Service.update({ })
     */
    next(new MethodNotAllowed(req.method + ' : ' + req.url));
  }

  private async remove(
    req: Request, res: Response, next: NextFunction
  ): Promise<void> {
    /**
     * await Service.remove(+req.params.id)
     */
    next(new MethodNotAllowed(req.method + ' : ' + req.url));
  }

  private async removeAll(
    req: Request, res: Response, next: NextFunction
  ): Promise<void> {
    /**
     * await Service.deleteALL()
     */
    next(new MethodNotAllowed(req.method + ' : ' + req.url));
  }
}