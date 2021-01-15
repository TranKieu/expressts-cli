import { Controller } from './controller.interface';

/* Test server */
import { IndexController } from './index.controller';

export const CONTROLLERS: Controller[] = [new IndexController()];
