export const information = () => {
    console.log('Usage: exp-g [options] [command] <command>');

    console.log('\n Typescript-Express generator\n');

    // Command
    console.log('Commands:  new|n [options] <project> \t Create new Project\n');
    console.log('Options:');
    console.log('\t -y, --yes \t\t\t skip all prompts and go for default options');
    console.log('\t -d, --database [value] \t database to use');
    console.log('\t -t, --template [value] \t template engine to use\n');

    console.log('Commands:  service|s <svname> \t\t generate new service\n');
    console.log('Commands:  controller|c  <ctName> \t generate new controller\n');

};

/**
 *
 */