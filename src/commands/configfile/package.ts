class Dependencies {
  'body-parser'?: string;
  'express'?: string;
  'reflect-metadata'?: string;
  'typeorm'?: string;
  'class-validator'?: string;
  // engine
  hbs?: string;
  ejs?: string;

  // database
  mysql?: string;
  mongodb?: string;
  mssql?: string;
  pg?: string;
  oracledb?: string;
}
class Package {
  name = 'tsexpressstart';

  version = '0.0.0';

  description = '';

  main = './src/app.ts';

  scripts = {
    start: 'node dist/app',
    dev: 'ts-node-dev --no-notify --respawn --transpile-only src/app',
    build: 'tsc -p .'
  };

  keywords = [];
  author = 'tranvd2010 <tranvd2010@gmail.com>';
  homepage = 'https://trankieu.github.io';

  devDependencies: {
    [key: string]: string;
  } = {};

  dependencies = new Dependencies();
}

export const pkg = new Package();
