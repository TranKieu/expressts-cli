import { Controller } from './controller.interface';
import { HttpServer } from '../server/http-server';
import { Response, Request, NextFunction } from 'express';
import { environment } from '../environment';

// Errors
import { MethodNotAllowed } from '../errors';

// Import Services

// Middelwares
import { log } from '../middlewares/log.middleware'; 

export class RESOURCEController implements Controller {

  // URL luôn là số nhiều
  private router = environment.API_URL + '/RESRCURIs';

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

  private async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
    } catch (error) {
      next(error);
    }
  }

  private async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      res.json();
    } catch (error) {
      next(error);
    }
  }

  private async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      res.json();
    } catch (error) {
      next(error);
    }
  }

  private async update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      res.json();
    } catch (error) {
      next(error);
    }
  }

  private async remove(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      res.json();
    } catch (error) {
      next(error);
    }
  }

  private async removeAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      res.json();
    } catch (error) {
      next(error);
    }
  }
}