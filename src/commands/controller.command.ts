import { modifyFile, isExists } from '../utils/file.utils';
import path from 'path';
import chalk from 'chalk';
import { readFilebyLine } from '../utils/readFileByLine';
import { writeFile } from '../utils/file.utils';

export const generateController
    = async (ctName: string, pathToController: string) => {

        const fileName = ctName.toLowerCase() + '.controller.ts';
        const newCtl = path.resolve(pathToController, fileName);

        if (await isExists(newCtl)) {
            console.error(
                `\t File ${chalk.red(fileName)} already exist!`
            );
            process.exit(1);
        }

        const tplctl =
            path.resolve(__dirname, '../templates/controller/controller.tpl');

        const reuri = ctName.toLowerCase() + 's';
        const search = /RESOURCE|RESRCURI/g;
        const replaces = {
            RESOURCE: ctName,
            RESRCURI: reuri
        };

        try {
            await modifyFile(tplctl, newCtl, search, replaces);
            console.log(
                `\t ${chalk.green.bold(fileName)} created successfully!`
            );
        } catch (error) {
            console.log(error);
            process.exit(1);
        }

        // update index Của controller
        const indexCt = path.resolve(pathToController, 'index.ts');
        try {
            let content = await readFilebyLine(ctName, indexCt);
            await writeFile(indexCt, content);
            console.log(
                `\t ${chalk.green.bold('controllers/index.ts')} updated successfully!`
            );
        } catch (error) {
            console.log(error);
            process.exit(1);
        }
    }