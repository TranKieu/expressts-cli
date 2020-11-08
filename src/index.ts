#!/usr/bin/env node
import program from 'commander';
import { createProject } from './commands/new.command';
import { generateService } from './commands/service.command';
import { generateController } from './commands/controller.command';
import { searchDir } from './utils/generate.helper';
import { information } from './utils/information';
import chalk from 'chalk';
import path from 'path';

const VERSION = '1.0.0';
const NAME = 'exp-g';
/**
 * + exp-g new <name-Projekt> --yes : tạo projekt vs default option
 *      option:
 *          - database: loại database lưu vào ormconfig
 *          - fontend: nếu có thì là: ejs, pug...
 *  - nếu có yes thì bỏ qua các option khác copy luôn
 *  - Nếu ko có yes thì xem xét option
 *          + có đúng kiểu ko nếu ko = ko có
 *          + Nếu ko có thì mặc định
 *  - Nếu ko có = viết sai thì dùng inquirer cho MissingOptions
 *
 *
 * + exp-g service <name> --entity <n>: tạo service vs entity
 * + exp-g controller <name>: tạo controller, phải input vào index
 */
program
  .version(VERSION)
  .name(NAME)
  .description('Typescript-Express generator')
  .arguments('<command>')
  .action((command) => {
    console.log('Command %s does not exits!', chalk.red.bold(command));
    information();
  });

program
  .command('new <project>')
  .alias('n')
  .option('-d, --database [value]', 'DBMS')
  .option('-t, --template [value]', 'Template Engine') // deufault = undefined
  .option('-y, --yes', 'Default Project', false)
  .description('Create new Project')
  .action((project, options) => createProject(project, options));

program
  .command('service <svName>')
  .alias('s')
  .description('generate new service')
  .action(async (svName) => {
    // Such dir
    let pathToService = await searchDir('services');

    if (pathToService === undefined) {
      console.log(chalk.red.bold('Project does not exits!'));
    } else {
      // tạo service
      generateService(svName, pathToService);

      // tạo Controller đi kèm
      let pathToController = path.resolve(pathToService, '../controllers');
      generateController(svName, pathToController);
    }
  });

program
  .command('controller <ctName>')
  .alias('c')
  .description('generate new controller')
  .action(async (ctName) => {
    // Such dir
    let pathToController = await searchDir('controllers');

    if (pathToController === undefined) {
      console.log(chalk.red.bold('Project does not exits!'));
    } else {
      // tạo Controller
      generateController(ctName, pathToController);

      let pathToService = path.resolve(pathToController, '../services');
      // tạo service
      generateService(ctName, pathToService);
    }
  });

program.parse(process.argv);

// unsupported command
if (process.argv.length < 3) {
  information();
}
