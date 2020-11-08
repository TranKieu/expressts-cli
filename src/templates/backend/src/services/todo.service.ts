import { getMongoRepository, ObjectID } from "typeorm";
import { Todo } from "../entity/todo";
import { NotFound } from "../errors/notfound.error";
import { TodoExist } from "../errors/todoexist.error";
import { validate } from "class-validator";

class TodoService {
  public async getAll(): Promise<Todo[]> {
    try {
      return await getMongoRepository(Todo).find({
        order: {
          created: "ASC",
        },
      });
    } catch (error) {
      throw error;
    }
  }
  public async getById(id: ObjectID): Promise<Todo> {
    try {
      return await getMongoRepository(Todo).findOneOrFail(id);
    } catch (error) {
      let message = `Todo: ${id}`;
      throw new NotFound(message);
    }
  }

  public async create(todo: Todo): Promise<Todo> {
    try {
      return await getMongoRepository(Todo).save(todo);
    } catch (error) {
      if (error.code === 11000) {
        throw new TodoExist(todo.content);
      } else {
        throw error;
      }
    }
  }

  public async update(todo: Todo): Promise<Todo> {
    try {
      let upTodo = await getMongoRepository(Todo).findOneOrFail(todo.id);
      /** let result = x || 10;
       *  result = 10 wenn x =
       *   +  0
       *   +  null
       *   +  undefined
       *   +  NaN
       *   +  "" (empty string)
       *   +  false  <= chú ý vs isComplated
       */
      upTodo.content = todo.content || upTodo.content;
      upTodo.created = todo.created || upTodo.created;

      upTodo.isCompleted =
        todo.isCompleted === undefined ? upTodo.isCompleted : todo.isCompleted;
      //validator
      console.log("ser ", upTodo);

      const errors = await validate(upTodo);
      if (errors.length > 0) {
        console.log("them cach tao message loi de throw");
        throw errors;
      }
      // save

      return await getMongoRepository(Todo).save(upTodo);
    } catch (error) {
      throw error;
    }
  }

  public async delete(id: ObjectID): Promise<Todo> {
    let delTodo: Todo;
    // cach xoa chac chan va don gian
    try {
      delTodo = await getMongoRepository(Todo).findOneOrFail(id);
      // tim thay thi xoa = tra lai todo co id = undefined
      return await getMongoRepository(Todo).remove(delTodo);
    } catch (error) {
      throw new NotFound(`Todo: ${id}`);
    }
  }
  public async deleteTodos(ids: string[]): Promise<void> {
    let todos: Todo[] = [];
    for (let i = 0; i < ids.length; i++) {
      try {
        todos[i] = await getMongoRepository(Todo).findOneOrFail(ids[i]);
      } catch (error) {
        throw new NotFound(`Todo: ${ids[i]}`);
      }
    }
    // tim thay het cac Todos
    try {
      await getMongoRepository(Todo).remove(todos);
    } catch (error) {
      throw error;
    }
  }
}
export const todoService = new TodoService();
