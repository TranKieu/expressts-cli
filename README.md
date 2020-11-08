# expressts-cli

TypeScript Express Start Project generator

## Installation

1. Clone our repository:

```sh

$ git clone https://github.com/TranKieu/expressts-cli.git

```

2. Install dependencies

```sh

$ cd expressts-cli
$ npm install

```

3. Build our app with command:

```sh
$ npm run build

```

4. Install our app globally from local source code:

```sh
$ npm install -g ./

```

## Quick Start

After installation is completed, we can use command `exp-g new` to
create new express project with Typescript:

```sh
$ exp-g new <projectname> [options]
```

## Command Options

    -y, --yes               skip all prompts and go for default options.

    -d, --database [value]  database to use.

    -t, --template [value]  template engine to use. deufault = undefined

    -h, --help              output usage information

## License

[MIT](LICENSE)

## Todo

- install automatically all the dependencies for the project.
- publish the app to npm...
