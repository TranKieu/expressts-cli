class Ormconfig {
    //Standart
    synchronize = true;
    logging = false;
    entities = [
        "src/entity/**/*.{ts,js}"
    ];
    migrations = [
        "src/migration/**/*.{ts,js}"
    ];
    subscribers = [
        "src/subscriber/**/*.{ts,js}"
    ];

    cli = {
        "entitiesDir": "src/entity",
        "migrationsDir": "src/migration",
        "subscribersDir": "src/subscriber"
    };

    type?: string;
    host = "localhost";
    port?: number;
    username = "";
    password = "";
    database = "";
    // chi vs mongodb
    useUnifiedTopology?: boolean;
    useNewUrlParser?: boolean;

}
export const orm = new Ormconfig();