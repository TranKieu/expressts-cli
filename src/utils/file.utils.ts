import fs from "fs";
import path from "path";
import { promisify } from "util";
import chalk from 'chalk';

const access = promisify(fs.access);
const copy = promisify(fs.copyFile);
//const lstat = promisify(fs.lstat); für symbolicLink
const stat = promisify(fs.stat);
const readDir = promisify(fs.readdir);
const mkDir = promisify(fs.mkdir);
const read = promisify(fs.readFile);
const write = promisify(fs.writeFile);

/**
 * Luôn phải dùng await 
 * if(await isExists)
 */
export const isExists = async (path: string) => {
    try {
        await access(path);
        return true;
    } catch (error) {
        if (error.code === "ENOENT") {
            return false;
        } else {
            // Lỗi khác
            console.error(error);
            return true;
        }
    }
};


async function copyFromArrayRecursive
    (files: string[], src: string, dest: string) {

    // Nếu ko có file nào nữa thì thoát ra
    if (files.length === 0) return true;

    // Loại File đã xử lý
    let f = <string>files.shift();
    // copy File đó
    await copyDir(path.join(src, f), path.join(dest, f));
    // Gọi lại Funktion cho tới hết
    await copyFromArrayRecursive(files, src, dest);
}

export const copyDir = async (src: string, dest: string) => {
    try { // chỉ cần có Error ở bất cứ đâu là bị bung ra

        // Lấy Stast = Tất cả Metadaten của File
        let stats = await stat(src);

        if (stats.isDirectory()) {
            // Directory => Nếu cần thì thêm symbolicLink

            // Nếu thư mục chưa tồn tại thì tạo mới
            if (!(await isExists(dest))) {
                // chưa tồn tại tạo mới
                await mkDir(dest);
            }
            // Lấy danh sách file + subDirectory
            let files = await readDir(src);

            // Thay vì dùng copyFromArrayRecursive có thể dùng for
            await copyFromArrayRecursive(files, src, dest);
        } else if (stats.isFile()) {
            // File
            // Fail nếu có file trùng tên
            await copy(src, dest, fs.constants.COPYFILE_EXCL);
            // ko có lỗi sẽ báo ra dòng này
            console.log(`\t ${chalk.green(dest)} copied successfully!`);
            return true;
        }
        // Ko phải File và Directory
        return false;
    } catch (error) {
        console.log(error);
        process.exit(1); // kết thúc chương trình
    }
};

export const writeFile = async (dest: string, content: string) => {
    try {
        await write(dest, content, { encoding: "utf8" })
    } catch (error) {
        console.log(error);
        process.exit(1); // kết thúc chương trình
    }

}


export const modifyFile = async (
    src: string,
    dest: string,
    search: RegExp,
    replaces: any
) => {
    try {
        let content = await read(src, { encoding: "utf8" });

        // Replace
        let modify = content.replace(search, matched => {
            return replaces[matched];
        });
        await write(dest, modify, { encoding: "utf8" });
    } catch (err) {
        if (err.code === "ENOENT") {
            console.error(`\t ${chalk.red.bold(src)} does not exist!`);
            throw err;
        }

        console.log(err);
        process.exit(1);
    }
};