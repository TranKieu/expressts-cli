import { getMongoRepository } from 'typeorm';
import { ObjectID as ObjectIDType } from 'typeorm';
import { Todo } from '../entity/todo';
export { Todo } from '../entity/todo';
import { NotFound } from '../errors/notfound.error';
import { TodoExist } from '../errors/todoexist.error';
import { validate } from 'class-validator';

class TodoService {
  public async getAll(): Promise<Todo[]> {
    try {
      return await getMongoRepository(Todo).find();
    } catch (error) {
      throw error;
    }
  }

  public async getById(id: ObjectIDType): Promise<Todo> {
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
      // bt nên bắt hết lỗi đầu vào mới truy vấn
      let upTodo = await getMongoRepository(Todo).findOneOrFail(todo.id);
      /** let result = x || 10; gt lại cái này khi xong angular
       *  result = 10 wenn x =
       *   +  0
       *   +  null
       *   +  undefined
       *   +  NaN
       *   +  "" (empty string)
       *   +  false  <= chú ý vs isComplated
       */
      upTodo.content = todo.content || upTodo.content;

      upTodo.isCompleted =
        todo.isCompleted === undefined ? upTodo.isCompleted : todo.isCompleted;

      /** Cách tìm hiểu lỗi
       *  + In Dữ liệu đầu vào ra để so sánh
       *  + Đánh dấu phần catch được thực thi
       *  + Tự cho nó gửi lỗi về Client
       *  + Bóc tách Lỗi để viết lại
       */
      console.log('ser ', upTodo);

      /** validator Entity
       *   Use function trong class-validator
       *   => Tìm hiểu cách sử dụng nó
       *   => Các Error nó bắn ra
       * */
      const errors = await validate(upTodo);
      if (errors.length > 0) {
        console.log('them cach tao message loi de throw');
        // cứ gửi lỗi đi rồi viết lại theo yêu cầu
        throw errors;
      }
      // save
      return await getMongoRepository(Todo).save(upTodo);
    } catch (error) {
      throw error;
    }
  }

  public async delete(id: ObjectIDType): Promise<Todo> {
    let delTodo: Todo;
    try {
      delTodo = await getMongoRepository(Todo).findOneOrFail(id);
      // tim thay thi xoa = tra lai todo co id = undefined
      /** Tìm thấy thì xóa . Return:
       *  + id = đã xóa todo có id đó
       *  + undefined = ko xóa được .
       * => Mọi lỗi sẽ được bắn ra
       */
      return await getMongoRepository(Todo).remove(delTodo);
    } catch (error) {
      // vì biết là lỗi gì nên báo cho Client lỗi này
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
    // Tìm được hết các Todos cần xóa
    try {
      await getMongoRepository(Todo).remove(todos);
    } catch (error) {
      throw error;
    }
  }
}

export const todoService = new TodoService();
