import { getRepository } from 'typeorm';

import { NotFound } from '../errors';

class ENTITYService {

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