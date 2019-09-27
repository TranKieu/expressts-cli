#!/usr/bin/env node
import program from 'commander';
import { createProject } from './commands/new.command';
import { generateService } from './commands/service.command';
import { generateController } from './commands/controller.command';
import { information } from './utils/information';
import chalk from 'chalk';

const VERSION = '0.0.1';
const NAME = 'exp-g';
/**
 * + exp-g new <name-Projekt> --yes : tạo projekt vs default option
 *      option:
 *          - database: loại database lưu vào ormconfig
 *          - fontend: nếu có thì là: ejs, pug...  
 * 
 * + exp-g service <name> --entity <n>: tạo service vs entity
 * + exp-g controller <name>: tạo controller, phải input vào index 
 */
program
    .version(VERSION).name(NAME)
    .description('Typescript-Express generator')
    .arguments('<command>')
    .action((command) => {
        console.log('Command %s does not exits!',
            chalk.red.bold(command));
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



program.parse(process.argv);

// unsupported command
if (process.argv.length < 3) {
    information();
};