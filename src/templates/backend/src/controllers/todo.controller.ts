import { Controller } from "./Controller";
import { Todo } from "../entity/Todo";
import { HttpServer } from "../server/http-server";
import { ObjectID } from "mongodb";
import { Response, Request, NextFunction } from "express";
import { todoService } from "../services/todo.service";
import { BadRequest } from "../errors/badrequest.error";

import { Environment } from "../environment";

export class TodoController implements Controller {
  private router = `${Environment.getVersion()}/todos`;

  init(http: HttpServer): void {
    http.get(`${this.router}`, this.getAll.bind(this));
    http.get(`${this.router}/:id([0-9a-fA-F]{24})`, this.get.bind(this));
    http.post(`${this.router}`, this.create.bind(this));

    http.put(`${this.router}/:id([0-9a-fA-F]{24})`, this.edit.bind(this));

    http.delete(`${this.router}/:id([0-9a-fA-F]{24})`, this.delete.bind(this));
    http.delete(`${this.router}`, this.deleteTodos.bind(this));
  }

  /**
   * + Validate đầu vào tại Controller
   * + Validate Entity tại Service
   * + Xử lý Error tại Controller vs next
   * + Throw Error tại Service => chú ý loại lỗi
   */
  // Lay het ra
  private async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      res.json(await todoService.getAll());
    } catch (error) {
      // phan chinh la oki neu co loi la do datatbase
      // ko co Tabel, ko ket noi dc
      next(error);
    }
  }
  private async get(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    // dung Regexp tai url nen ko can validate
    let id = new ObjectID(req.params.id);
    try {
      res.json(await todoService.getById(id));
    } catch (error) {
      next(error);
    }
  }
  // create
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
      // hoan thanh gui result ve
      res.status(200).json({ message: "phai gui gi ve neu ko no chay mai" });
    } catch (error) {
      next(error);
    }
  }

  // edit 1 todo
  private async edit(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    let id = req.params.id;
    // kiem tra id => ko can gi da co uri
    const idRegexp: RegExp = /^[0-9a-fA-F]{24}$/;
    if (!id.match(idRegexp)) {
      next(new BadRequest(id));
      return;
    }
    // neu ko co tu dong = undefined
    let { content, isCompleted, created } = req.body;

    //Validate
    let todo = new Todo();
    todo.id = new ObjectID(id);
    todo.content = content;
    todo.isCompleted = isCompleted;
    todo.created = created;
    console.log("controll: ", todo);

    try {
      // neu ko co gi thay doi no tra ve null
      res.json(await todoService.update(todo));
    } catch (error) {
      next(error);
    }

    // oki => schreiben in datenbank
  }

  // Xoa 1 todo
  private async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    // validate id
    let id = new ObjectID(req.params.id);
    try {
      let delResult = await todoService.delete(id);

      // Da tim thay thi phai xoa dc neu ko loi khac
      if (delResult) {
        res.status(200).json({ message: "Delete thanh cong" });
      } else {
        res.status(404).json({ message: "Ko xoa gi het" });
      }
    } catch (error) {
      next(error);
    }
  }

  // xoa vai todos => tich vai cai roi xoa
  private async deleteTodos(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    // chuan ca do dai
    const idRegexp: RegExp = /^[0-9a-fA-F]{24}$/;

    const ids: string[] = Object.values(req.body);
    // Validate id
    const message = ids.filter((idTodo) => !idTodo.match(idRegexp)).join(", ");

    if (message.length === 0) {
      // Validate tat ca id oki moi thuc thi 1 luot
      // remove duplicates
      const todoIds = [...new Set(ids)];

      try {
        await todoService.deleteTodos(todoIds);
      } catch (error) {
        next(error);
        return; // loi dung lai luon
      }
      res.send({ message: "Delete thanh cong" });
    } else {
      next(new BadRequest(message));
    }
  }
}
