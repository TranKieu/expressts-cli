import inquirer from 'inquirer';
import chalk from 'chalk';
import * as path from 'path';

import { isExists, copyDir, modifyFile, writeFile }
    from '../utils/file.utils';
// config
import { pkg } from './configfile/package';
import { orm } from './configfile/ormconfig';


// Database
const DB = ['mysql', 'mongodb', 'mssql', 'pg', 'oracledb'];
const defaultDB = 'mysql';
/**
 *      "mysql": "latest"
 */

// Engine
const ENGINE = [undefined, 'ejs', 'hbs'];
const defaultEngine = 'ejs';
/**
 * "ejs": "latest"
 */



async function promptForDatabaseOption(): Promise<string> {

    // Tạo Câu hỏi nhắc nhở 
    const questions = [
        {
            type: 'list',
            name: 'database',
            message: 'Please choose which database to use',
            choices: DB,
            default: defaultDB
        }
    ];

    const answers = await inquirer.prompt<{ database: string }>(questions);
    return answers.database;
}

async function promptForTemplateOption(): Promise<string> {

    // ENGINE: xoa undefined
    const questions = [
        {
            type: 'list',
            name: 'template',
            message: 'Please choose which template engine for Project',
            choices: ENGINE.splice(1),
            default: defaultEngine
        }
    ];

    const answers = await inquirer.prompt<{ template: string }>(questions);
    return answers.template;
}

interface Options {
    database: string,
    template: string | undefined,
    yes: boolean
}

export const createProject = async (name: string, options: Options) => {

    //const projectDir = path.resolve(process.cwd(), name);
    const projectDir = name;
    // kiểm tra xem Project tồn tại chưa
    if (await isExists(projectDir)) {
        console.error(
            chalk.red.bold('Error!'), `\t Directory ${name} already exist!`
        );
        process.exit(1);
    }

    if (options.yes) {
        // Default Project yes = true
        options.database = 'mysql';
        options.template = undefined;
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
    let srcBackend = path.resolve(__dirname, '../templates/backend');
    await copyDir(srcBackend, projectDir);

    console.log(chalk.green.bold('\n\t Add view engine:'));
    // addViewEngine 
    let destFontend = path.join(projectDir, 'src');
    await addViewEngine(options.template, destFontend);

    console.log();
    // addDatabaseDrive
    await addDatabaseDrive(options.database, projectDir);

    // dựa vào tất cả tạo file package
    await createPackage(projectDir);

    console.log('\t %s Project ready!', chalk.green.bold(name));
};

async function addViewEngine(template: string | undefined, pDir: string) {
    if (template === undefined) {
        console.log(chalk.yellow('\t Does not need Views!'));
        return;
    }
    const setEngine = 'private setupTemplate(server: Express) { \n'
        + '\t\tserver.set("views", "src/views");\n'
        + '\t\tserver.set("view engine", "ENGINE");\n'
        + '\t\tserver.use("/assets",\n'
        + '\t\t\texpress.static(path.join(__dirname, "../public")));\n'
        + '\t}';
    let viewEngine = '';
    switch (template) {
        case 'hbs':
            pkg.dependencies.hbs = 'latest';
            viewEngine = setEngine.replace(/ENGINE/g, 'hbs');
            break;
        case 'ejs':
            pkg.dependencies.ejs = 'latest';
            viewEngine = setEngine.replace(/ENGINE/g, 'ejs');
        default:
            // undefined
            break;
    }
    try {
        // copy fontend => tam thoi chi dung ejs
        let srcFontend = path.resolve(__dirname, '../templates/fontend');
        await copyDir(srcFontend, pDir);

        // copy index.controller.ts
        let indexSrc = path.resolve
            (__dirname, '../templates/controller/index.controller.tpl');
        let indexDest = path.join(pDir, 'controllers/index.controller.ts');
        await copyDir(indexSrc, indexDest);

        // Ghi đè ServerExpress 
        let search = /{{TemplController}}|{{TemplateFunktion}}/g;
        let replaces = {
            '{{TemplateFunktion}}': viewEngine,
            '{{TemplController}}': 'this.setupTemplate(this.server);'
        }

        //let src = path.resolve(__dirname, '../templates/server/ExpressServer.tpl');
        let src = path.resolve(__dirname, '../templates/server/ExpressServer.tpl');
        let exServerdest = path.join(pDir, 'server/ExpressServer.ts');

        // neu ben trong ko throw error thi luon luon oki
        await modifyFile(src, exServerdest, search, replaces);
        console.log(
            `\t ${chalk.green.bold(exServerdest)} updated successfully!`
        );
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}


async function addDatabaseDrive(db: string, projectDir: string) {
    switch (db) {
        case 'mssql':
            pkg.dependencies.mssql = 'latest';
            orm.type = 'mssql';
            orm.port = 1433;
            break;
        case 'mongodb':
            pkg.dependencies.mongodb = 'latest';
            orm.type = 'mongodb';
            orm.port = 40167;
            orm.useNewUrlParser = true;
            orm.useUnifiedTopology = true;
            break;
        case 'pg':
            pkg.dependencies.pg = 'latest';
            orm.type = 'pg';
            orm.port = 5432;
            break;
        case 'oracledb':
            pkg.dependencies.oracledb = 'latest';
            orm.type = 'oracledb';
            orm.port = 1521;
            break;
        default:
            pkg.dependencies.mysql = 'latest';
            orm.type = 'mysql';
            orm.port = 3306;
            break;
    }
    // ghi file ormconfig.json
    try {
        let ormFile = path.resolve(projectDir, 'ormconfig.json');

        await writeFile(ormFile, JSON.stringify(orm, undefined, 5));
        console.log('\t File ',
            chalk.green.bold('ormconfig.json'),
            ' created succesfully!'
        );
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

/**
 * Thay bang install tung module thi hay hon
 * @param projectDir 
 */
async function createPackage(projectDir: string) {
    // ghi file package
    try {
        let pkgFile = path.resolve(projectDir, 'package.json');

        await writeFile(pkgFile, JSON.stringify(pkg, undefined, 5));
        console.log('\t File ',
            chalk.green.bold('package.json'),
            ' created succesfully!'
        );
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}