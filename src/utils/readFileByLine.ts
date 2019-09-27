import fs from "fs";
import path from "path";
import { promisify } from "util";

const read = promisify(fs.readFile);

/** parm: ten controller can luu
 * + doc tu dau  neu trong line KO co import thi add import vao
 * + doc toi CONTROLLER => kiem tra
 *        - cuoi dong la ]; oder ] thi nhet new vao trc
 *        - cuoi dong ko co thi dua new vao do
 * + ghi file ra
 */

export const readFilebyLine = async (controller: string) => {
    // thay bang process.pwd();
    const indexController = path.resolve(
        __dirname,
        "templates/controller/index.ts"
    );
    // tao chuoi can dua vao
    const conImport =
        "import { " +
        controller +
        'Controller } from "./' +
        controller.toLowerCase() +
        '.controller";\r\n';
    const conNew = "\r\n \t new " + controller + "Controller()\r\n";

    console.log(conImport);
    console.log(conNew);

    let result = "";
    try {
        let content = await read(indexController, { encoding: "utf8" });
        let importFlag = true;
        let newFlag = true;
        let commaFlag = false;

        /**
         * Lamm dc vi file ngan
         * neu dai dung readline
         */
        let lines = content.split(/\r\n?|\n/);

        lines.forEach(line => {
            // hinzufügen import
            if (importFlag && line.indexOf("import") === -1) {
                importFlag = false;
                line += conImport;
            }

            if (commaFlag && line.includes("new")) {
                commaFlag = false;
                line = "," + line;
            }

            let index = line.lastIndexOf("[");
            if (newFlag && index > 0) {
                // gan vao sau [
                let temp = line.slice(0, index + 1) + conNew;
                newFlag = false;
                // neu dang sau co new thi them dau phay
                if (line.includes("new")) {
                    temp += ", " + line.slice(index + 1);
                } else if (line.includes("];")) {
                    // ko co new va co ]; => ko can phay
                    temp += line.slice(index + 1);
                } else {
                    // dong do ko co ca hai => doi den dong tiep theo
                    commaFlag = true;
                }
                line = temp;
            }
            // chi kiem tra khi da add new controller

            // gan lai line vao
            result += line + "\r\n";
        });
        console.log("-------");
        console.log("FILE: " + result);
    } catch (err) {
        if (err.code === "ENOENT") {
            console.error(`${indexController} does not exist!`);
            return;
        }
        console.log(err);
        return;
    }

    console.log("File processed.");
};
/*
const readline = require('readline');
const fs = require('fs');

// create instance of readline
// each instance is associated with single input stream
let rl = readline.createInterface({
    input: fs.createReadStream('products.txt')
});

let line_no = 0; // xem let co in ra ko

// event is emitted after each line
rl.on('line', function(line) {
    line_no++;
    console.log(line);
});

// end
rl.on('close', function(line) {
    console.log('Total lines : ' + line_no);
});
*/
//https://github.com/nodejs/help/issues/1292
//https://itnext.io/using-node-js-to-read-really-really-large-files-pt-1-d2057fe76b33
/* thu xem co luu ra file ko

var fs = require("fs"),
    readline = require("readline");

var reader = readline.createInterface({
  input: fs.createReadStream("large-file.txt"),
  output: fs.createWriteStream("/dev/null"),
  terminal: false
});

reader.on("line", function(line) {
  console.log("Line:", line);
  // them that o day
});


*/