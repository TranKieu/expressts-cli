import { Controller } from './controller';
import { Todo } from '../entity/Todo';
import { HttpServer } from '../server/http-server';
import { ObjectID } from 'mongodb';
import { ObjectID as ObjectIDType } from 'typeorm';
import { Response, Request, NextFunction } from 'express';
import { todoService } from '../services/todo.service';
import { BadRequest } from '../errors/badrequest.error';

import { Environment } from '../environment';

export class TodosController implements Controller {
  private path = `${Environment.getVersion()}/todos`;

  // Regular Express cho ID-path
  private idRegexp: string = '[0-9a-fA-F]{24}';

  /**
   * Khai báo các Routes ở đây
   * @param http : ExpressServer
   *
   * RequestHandler tương ứng với route sẽ được gọi:
   *  + Ko có Argument vs bind: this.nameFunk.bind(this)
   *  + vs Argument vs call: call.nameFunk.call(this, par...)
   *
   *  - this trong bind là chính nó chứ ko phải là class này.
   */
  init(http: HttpServer): void {
    /* => path für todos */

    // Read Alle Todos => học lấy dk cho RestFull
    http.get(this.path, this.getAll.bind(this));

    // Read One with id
    http.get(`${this.path}/:id(${this.idRegexp})`, this.get.bind(this));

    // Create new Todo
    http.post(this.path, this.create.bind(this));

    // Update One with id
    http.put(`${this.path}/:id(${this.idRegexp})`, this.edit.bind(this));

    // Delete One with id
    http.delete(`${this.path}/:id(${this.idRegexp})`, this.delete.bind(this));

    // Delete Alle
    http.delete(this.path, this.deleteTodos.bind(this));
  }

  /** => Nguyên tắc xử lý Request:
   *
   * + Validate đầu vào tại Controller
   * + Validate Entity tại Service
   * + Xử lý Error tại Controller vs next
   * + Throw Error tại Service => chú ý loại lỗi
   */

  private async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // luôn phải dùng await
      res.json(await todoService.getAll());
    } catch (error) {
      // Lỗi đến từ Service = truy vấn Database
      // bắn Error ra
      next(error);
    }
  }

  private async get(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    // DÙng Regular Express tại Url nên Id ko cần validate
    let id = new ObjectID(req.params.id) as ObjectIDType;
    try {
      res.json(await todoService.getById(id));
    } catch (error) {
      next(error);
    }
  }

  private async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    let { content } = req.body;

    let todo = new Todo();
    todo.content = content;

    try {
      await todoService.create(todo);
      // Hoàn thành status = 200
      res.status(200).json({
        message: 'Tạo mới thành công!'
      });
    } catch (error) {
      next(error);
    }
  }

  private async edit(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    let id = req.params.id;
    // Validate đầu vào
    if (!id.match(this.idRegexp)) {
      // Đưa lỗi về ErrorHandler
      // BadRequest = Tự khai báo
      next(new BadRequest(id));
      // kết thúc để code sau ko chạy
      return;
    }
    // Nếu trong body ko có nó tự = undefined
    let { content, isCompleted } = req.body;

    //Validate
    let todo = new Todo();
    todo.id = new ObjectID(id) as ObjectIDType;
    todo.content = content;
    todo.isCompleted = isCompleted;

    console.log('controll: ', todo);

    try {
      // Nếu ko có gì thay đổi sẽ trả về null
      // phải phát triền thêm về status trả về
      res.json(await todoService.update(todo));
    } catch (error) {
      next(error);
    }

    // oki => schreiben in datenbank
  }

  private async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    let id = new ObjectID(req.params.id) as ObjectIDType;
    try {
      let delResult = await todoService.delete(id);

      if (delResult) {
        res.status(200).json({ message: 'Delete thanh cong' });
      } else {
        res.status(404).json({ message: 'Ko xoa gi het' });
      }
    } catch (error) {
      next(error);
    }
  }

  private async deleteTodos(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const ids: string[] = Object.values(req.body);
    // Validate id
    const message = ids
      .filter((idTodo) => !idTodo.match(this.idRegexp))
      .join(', ');

    if (message.length === 0) {
      // Validate tất cả ID thì xóa hết đi
      // remove duplicates
      const todoIds = [...new Set(ids)];

      try {
        await todoService.deleteTodos(todoIds);
      } catch (error) {
        next(error);
        return; // loi dung lai luon
      }
      res.send({ message: 'Delete thanh cong' });
    } else {
      next(new BadRequest(message));
    }
  }
}
