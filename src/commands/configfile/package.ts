
class Dependencies {
    "body-parser" = "latest";
    "express" = "latest";
    "reflect-metadata" = "latest";
    "typeorm" = "latest";
    "class-validator" = "latest";
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

    version = "0.0.0";

    description = "";

    main = "./src/app.ts";

    scripts = {
        "start": "ts-node src/app.ts",
        "dev": "nodemon --watch src -e ts,ejs --exec \" npm run serve \"",
        "build": "tsc -p .",
        "serve": "ts-node src/app.ts"
    };

    keywords = [];
    author = " ";
    license = "ISC";

    devDependencies = {
        "@types/express": "latest",
        "@types/node": "latest",
        "nodemon": "latest",
        "ts-node": "latest",
        "typescript": "latest"
    };


    dependencies = new Dependencies();
}

export const pkg = new Package();