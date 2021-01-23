class Ormconfig {
  type?: string;
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  database?: string;

  // chi vs mongodb
  url?: string;
  useUnifiedTopology?: boolean;
  useNewUrlParser?: boolean;
  //Standart
  synchronize = true;
  logging = false;
  entities = ['src/entity/**/*.{ts,js}'];
  migrations = ['src/migration/**/*.{ts,js}'];
  subscribers = ['src/subscriber/**/*.{ts,js}'];

  cli = {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber'
  };
}
export const orm = new Ormconfig();
