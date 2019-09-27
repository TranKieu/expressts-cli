import path from 'path';
import fs from 'fs';

export const searchDir =
    async (dirFor: string): Promise<string | undefined> => {

        const pwdPath = process.cwd();
        const search = path.sep + 'src';
        /**
         * + Nếu dirFor có trong pwd 
         *  => đang ở trong thu muc can tao return luon
         * + Nếu ko có => tìm có /src => cắt từ đó nói vs path bt 
         * => ko có src read dir neus ko có src => in loi ra 
         */
        
        if (pwdPath.endsWith(dirFor)) {
            // đang trong thư mục dirFor
            return pwdPath;
        } else {
            let indSrc = pwdPath.indexOf(search);
            if (indSrc > 0) {
                // ở đâu đó dưới src
                let srcpath = pwdPath.slice(0, indSrc + 4);
                return path.join(srcpath, dirFor);
            } else {
                // ở ngoài thư mục src
                let hasSrc = false;
                fs.readdirSync(pwdPath).forEach(dir => {
                    if (dir === 'src') {
                        hasSrc = true;
                    }
                });
                if (hasSrc) {
                    return path.join(pwdPath, 'src', dirFor);
                }
            }
        }
    }