import { getRepository } from "typeorm";
import { ENTITY } from "../entity/ENTITY";
export { ENTITY } from "../entity/ENTITY";


class ENTITYService {
    /**
     * + Validate tại Controller
     * + Xử lý Error tại Controller
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