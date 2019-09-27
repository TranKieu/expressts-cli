import fs from "fs";
import path from "path";
import { promisify } from "util";

const read = promisify(fs.readFile);

export const readFilebyLine =
    async (controller: string, indexController: string): Promise<string> => {

        // Tạo chuỗi cần đưa vào
        const conImport =
            "import { " +
            controller +
            'Controller } from "./' +
            controller.toLowerCase() +
            '.controller";\r\n';
        const conNew = "\r\n \t new " + controller + "Controller()";

        let result = "";
        try {
            let content = await read(indexController, { encoding: "utf8" });
            let importFlag = true;
            let newFlag = true;
            let commaFlag = false;
            let newLine = true;

            /**
             * Làm ntn dc vì file ngắn
             * Nếu xử lý File lớn thì dùng readline
             */
            let lines = content.split(/\r\n?|\n/);

            lines.forEach(line => {
                // gắn import vào 
                if (importFlag && line.indexOf("import") === -1) {
                    importFlag = false;
                    line += conImport;
                }

                // đưa new Controller vào 
                if (commaFlag && line.includes("new")) {
                    commaFlag = false;
                    line = ",\r\n" + line;
                }

                let index = line.lastIndexOf("[");
                if (newFlag && index > 0) {
                    // đưa new Controller vào sau [ cuối cùng
                    let temp = line.slice(0, index + 1) + conNew;
                    newFlag = false;
                    newLine = false;
                    // Nếu đằng sau có Class khác thì thêm dấu phẩy
                    if (line.includes("new")) {
                        temp += ",\r\n " + line.slice(index + 1);
                    } else if (line.includes("];")) {
                        // ko có new và có ]; => chỉ có 1 class duy nhất
                        temp += line.slice(index + 1);
                    } else {
                        // ko có cả 2 thì phải xem xét dòng tiếp theo
                        commaFlag = true;
                    }
                    line = temp;

                }

                // Gắn từng dòng vào result
                if (newLine) {
                    result += line + "\r\n";
                } else {
                    result += line;
                    newLine = true;
                }
            });

        } catch (err) {
            if (err.code === "ENOENT") {
                console.error(`${indexController} does not exist!`);
            }
            console.log(err);
            process.exit(1);
        }
        return result;
    };

/*
const readline = require('readline');
const fs = require('fs');

//
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
    // Nếu in line_no ra thì có thể xử lý tạo file mới ở đây
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
  output: fs.createWriteStream("/dev/null"), // luu truc tiep ra file
  terminal: false
});

reader.on("line", function(line) {
  console.log("Line:", line);
  // them that o day
});
*/