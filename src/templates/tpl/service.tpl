import { getRepository } from 'typeorm';
import { ENTITY } from 'entity/ENTITY';
export { ENTITY } from '../entity/ENTITY';


class ENTITYService {
    /**
     * + Validate đầu vào tại Controller
     * + Validate Entity tại Service
     * + Xử lý Error tại Controller vs next
     * + Throw Error tại Service => chú ý loại lỗi
     */

    public async getById(id: number): Promise<ENTITY> {
        return null;
    }

    public async getAll(): Promise<ENTITY[]> {
        return null;
    }

    public async create(user: ENTITY): Promise<ENTITY> {
        return null;
    }

    public async update(user: ENTITY): Promise<ENTITY> {
        return null;
    }

    public async delete(id: number): Promise<any> {
        return null;
    }
}
export const obEntityService = new ENTITYService();