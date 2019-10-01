import 'reflect-metadata';
import { ExpressServer } from './server/ExpressServer';

// Controllers
import { CONTROLLERS } from './controllers/index';

import { createConnection } from 'typeorm';

// ormconfig.json
createConnection().then(async connection => {

    const server = new ExpressServer(CONTROLLERS);
    server.setup(3000);

}).catch(error => console.log("TypeORM connection error: ", error));
