import { modifyFile, isExists } from '../utils/file.utils';
import path from 'path';
import chalk from 'chalk';
import { capitalizeFirstLetter, wordUpperCase } from '../utils/generate.helper';

/**
 * @param svName
 *  * + Viết thường,
 * + Các từ cách nhau bằng -
 *
 * @param pathToService
 */
export const generateService = async (
  svName: string,
  pathToService: string
) => {
  const filename = svName + '.service.ts';

  const newService = path.resolve(pathToService, filename);

  if (await isExists(newService)) {
    console.error(`\t File ${chalk.red(filename)} already exist!`);
    process.exit(1);
  }

  const tplSer = path.resolve(__dirname, '../templates/tpl/service.tpl');

  const obj = wordUpperCase(svName);
  const service = capitalizeFirstLetter(obj);
  const search = /ENTITY|obEntity/g;
  const replaces = {
    ENTITY: service,
    obEntity: obj,
  };

  try {
    await modifyFile(tplSer, newService, search, replaces);
    console.log(`\t ${chalk.green.bold(filename)} created successfully!`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
