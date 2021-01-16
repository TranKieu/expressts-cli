import { getRepository } from 'typeorm';

import { NotFound } from '../errors';

class ENTITYService {
    /**
     * + Validate đầu vào tại Controller
     * + Validate Entity tại Service
     * + Xử lý Error tại Controller vs next
     * + Throw Error tại Service => chú ý loại lỗi
     */

    public async getAll(): Promise<ENTITY[]> {
		try { // Lấy Resource từ Db ra: 
		  return await getRepository(ENTITY).find();
		} catch (error) {
		  throw error;
		}
    }

    public async create(user: ENTITY): Promise<ENTITY> {
        throw new NotFound('Resource');
    }

    public async getById(id: number): Promise<ENTITY> {
        throw new NotFound('Resource');
    }

    public async update(user: ENTITY): Promise<ENTITY> {
        throw new NotFound('Resource');
    }

    public async delete(id: number): Promise<any> {
        throw new NotFound('Resource');
    }
}
export const obEntityService = new ENTITYService();