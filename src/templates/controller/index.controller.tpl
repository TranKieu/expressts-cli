import { Request, Response } from 'express';
import { Controller } from './Controller';
import { HttpServer } from '../server/HttpServer';


export class IndexController implements Controller {

    init(httpServer: HttpServer): void {
        /**
         * Tất cả các Router add vào đây
         */
        httpServer.get('/', this.get.bind(this));
    }

    private async get(req: Request, res: Response): Promise<void> {
        res.render('index', { title: 'Hallo' });
    }
}