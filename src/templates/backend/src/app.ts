import 'reflect-metadata';
import { ExpressServer } from './server/ExpressServer';

// Controllers
import { CONTROLLERS } from './controllers/index';

// Database 
import { DatabaseProvider } from './database/index';
import { createConnection } from "typeorm";
/*
DatabaseProvider.configure({
    type: 'mysql',
    host: 'localhost',
    database: 'restful',
    username: 'root',
    password: '',
    port: 3306
});
*/
// tu nap tu file ormconfig.json
createConnection().then(async connection => {
    /**
     * 
     */
    const server = new ExpressServer(CONTROLLERS);
    server.setup(3000);

}).catch(error => console.log("TypeORM connection error: ", error));
/**  Services
 *  chiu trach nhiem ket noi datenbank lay du lieu ra de con troller sd
 *
 * thu ham ma thay vi cho request vao con 1 array middlware
 *
 */