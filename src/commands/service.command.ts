import { modifyFile, isExists } from '../utils/file.utils';
import path from 'path';
import chalk from 'chalk';
export const generateService
    = async (svName: string, pathToService: string) => {

        const filename = svName + 'Service.ts';

        const newService = path.resolve(pathToService, filename);

        if (await isExists(newService)) {
            console.error(
                `\t File ${chalk.red(filename)} already exist!`
            );
            process.exit(1);
        }

        const tplSer =
            path.resolve(__dirname, '../templates/service/service.tpl');

        const obj = svName.charAt(0).toLowerCase() + svName.slice(1);
        const search = /ENTITY|obEntity/g;
        const replaces = {
            ENTITY: svName,
            obEntity: obj
        };

        try {
            await modifyFile(tplSer, newService, search, replaces);
            console.log(
                `\t ${chalk.green.bold(filename)} created successfully!`
            );
        } catch (error) {
            console.log(error);
            process.exit(1);
        }
    }