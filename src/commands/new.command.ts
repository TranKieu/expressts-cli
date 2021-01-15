import inquirer from 'inquirer';
import chalk from 'chalk';
import * as path from 'path';

import { isExists, copyDir, modifyFile, writeFile } from '../utils/file.utils';
import { lastest } from '../utils/generate.helper';
// config
import { pkg } from './configfile/package';
import { orm } from './configfile/ormconfig';

// Database
const DB = ['mysql', 'mongodb', 'mssql', 'pg', 'oracledb'];

// Engine
const ENGINE = ['no-engine', 'ejs', 'hbs'];

async function promptForDatabaseOption(): Promise<string> {
  // Tạo Câu hỏi nhắc nhở
  const questions = [
    {
      type: 'list',
      name: 'database',
      message: 'Please choose which database to use',
      choices: DB
    }
  ];

  const answers = await inquirer.prompt<{ database: string }>(questions);
  return answers.database;
}

async function promptForTemplateOption(): Promise<string> {
  // ENGINE
  const questions = [
    {
      type: 'list',
      name: 'template',
      message: 'Please choose which template engine for Project',
      choices: ENGINE
    }
  ];

  const answers = await inquirer.prompt<{ template: string }>(questions);
  return answers.template;
}

interface Options {
  database: string;
  template: string;
  yes: boolean;
}

export const createProject = async (name: string, options: Options) => {
  //const projectDir = path.resolve(process.cwd(), name);
  const projectDir = name;
  // kiểm tra xem Project tồn tại chưa
  if (await isExists(projectDir)) {
    console.error(
      chalk.red.bold('Error!'),
      `\t Directory ${name} already exist!`
    );
    process.exit(1);
  }

  if (options.yes) {
    // Default Project yes = true
    options.database = 'mysql';
    options.template = 'no-engine';
  } else {
    // kiểm tra database
    if (DB.indexOf(options.database) == -1)
      options.database = await promptForDatabaseOption();

    // kiểm tra template
    if (ENGINE.indexOf(options.template) == -1)
      options.template = await promptForTemplateOption();
  }

  /* xử lý xong vs Options => tạo Project */
  console.log();
  console.log('\t Create Project: ', chalk.green.bold(name));
  console.log('\t\t**********\n');

  // Copy Backend
  console.log(chalk.green.bold('\n\t Copy Templates:'));
  const srcBackend = path.resolve(__dirname, '../templates/backend');
  await copyDir(srcBackend, projectDir);

  console.log(chalk.green.bold('\n\t Add view engine:'));
  // addViewEngine
  const destFontend = path.join(projectDir, 'src');
  await addViewEngine(options.template, destFontend);

  console.log();
  // addDatabaseDrive
  await addDatabaseDrive(options.database, projectDir);

  // dựa vào tất cả tạo file package
  await createPackage(projectDir);

  console.log('\t %s Project ready!\n', chalk.green.bold(name));
};

async function addViewEngine(template: string | undefined, pDir: string) {
  if (template === 'no-engine') {
    console.log(chalk.yellow('\t Does not need Views!'));
    return;
  }
  const setEngine =
    'private setupTemplate(server: Express) { \n' +
    '\t\tserver.set("views", "src/views");\n' +
    '\t\tserver.set("view engine", "ENGINE");\n' +
    '\t\tserver.use("/assets",\n' +
    '\t\t\texpress.static(path.join(__dirname, "../public")));\n' +
    '\t}';
  let viewEngine = '';
  switch (template) {
    case 'hbs':
      pkg.dependencies.hbs = (await lastest('hbs')) as string;
      viewEngine = setEngine.replace(/ENGINE/g, 'hbs');
      break;
    case 'ejs':
      pkg.dependencies.ejs = (await lastest('ejs')) as string;
      viewEngine = setEngine.replace(/ENGINE/g, 'ejs');
    default:
      // undefined
      break;
  }
  try {
    // copy fontend => tam thoi chi dung ejs
    const srcFontend = path.resolve(__dirname, '../templates/fontend');
    await copyDir(srcFontend, pDir);

    // index.controller.ts có sẵn chỉ cần thay đổi

    // Ghi đè ServerExpress
    const search = /{{TemplateFunktion}}/g;
    const replaces = {
      '{{TemplateFunktion}}': viewEngine
    };

    //
    const src = path.resolve(__dirname, '../templates/tpl/express-server.tpl');
    const exServerdest = path.join(pDir, 'server/express-server.ts');

    // neu ben trong ko throw error thi luon luon oki
    await modifyFile(src, exServerdest, search, replaces);
    console.log(`\t ${chalk.green.bold(exServerdest)} updated successfully!`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

async function addDatabaseDrive(db: string, projectDir: string) {
  switch (db) {
    case 'mssql':
      //lastest('mssql').then( version =>{ pkg.dependencies.mssql = <string> version });
      pkg.dependencies.mssql = (await lastest('mssql')) as string;
      pkg.devDependencies['@types/mssql'] = (await lastest(
        '@types/mssql'
      )) as string;
      orm.type = 'mssql';
      orm.port = 1433;
      break;
    case 'mongodb':
      pkg.dependencies.mongodb = (await lastest('mongodb')) as string;
      pkg.devDependencies['@types/mongodb'] = (await lastest(
        '@types/mongodb'
      )) as string;
      orm.type = 'mongodb';
      orm.port = 27017;
      orm.useNewUrlParser = true;
      orm.useUnifiedTopology = true;
      break;
    case 'pg':
      pkg.dependencies.pg = (await lastest('pg')) as string;
      pkg.devDependencies['@types/pg'] = (await lastest('@types/pg')) as string;
      orm.type = 'pg';
      orm.port = 5432;
      break;
    case 'oracledb':
      pkg.dependencies.oracledb = (await lastest('oracledb')) as string;
      pkg.devDependencies['@types/oracledb'] = (await lastest(
        '@types/oracledb'
      )) as string;
      orm.type = 'oracledb';
      orm.port = 1521;
      break;
    default:
      pkg.dependencies.mysql = (await lastest('mysql')) as string;
      pkg.devDependencies['@types/mysql'] = (await lastest(
        '@types/mysql'
      )) as string;
      orm.type = 'mysql';
      orm.port = 3306;
      break;
  }
  // ghi file ormconfig.json
  try {
    const ormFile = path.resolve(projectDir, 'ormconfig.json');

    await writeFile(ormFile, JSON.stringify(orm, undefined, 5));
    console.log(
      '\t File ',
      chalk.green.bold('ormconfig.json'),
      ' created succesfully!'
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

/**
 * Sau này thay bằng Install các Dependencies
 */
async function createPackage(projectDir: string) {
  // devDependencies
  pkg.devDependencies['@types/express'] = (await lastest(
    '@types/express'
  )) as string;
  pkg.devDependencies['@types/node'] = (await lastest('@types/node')) as string;
  pkg.devDependencies['ts-node-dev'] = (await lastest('ts-node-dev')) as string;
  pkg.devDependencies['typescript'] = (await lastest('typescript')) as string;

  //Dependencies
  pkg.dependencies['body-parser'] = (await lastest('body-parser')) as string;
  pkg.dependencies['express'] = (await lastest('express')) as string;
  pkg.dependencies['reflect-metadata'] = (await lastest(
    'reflect-metadata'
  )) as string;
  pkg.dependencies['typeorm'] = (await lastest('typeorm')) as string;
  pkg.dependencies['class-validator'] = (await lastest(
    'class-validator'
  )) as string;
  // ghi file package
  try {
    const pkgFile = path.resolve(projectDir, 'package.json');

    await writeFile(pkgFile, JSON.stringify(pkg, undefined, 5));
    console.log(
      '\t File ',
      chalk.green.bold('package.json'),
      ' created succesfully!'
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
