import archiver from 'archiver';
import FormData from 'form-data';
import fs, { existsSync } from 'fs';
import path from 'path';

export class Utils {

  public async createFormDataWithFile(key: string, filePath: string) {
    const form = new FormData();
    if (existsSync(filePath)) {
      const dataFile = fs.createReadStream(filePath);
      form.append(key, dataFile);
    } else {
      console.error(`Results file was not found: ${filePath}`);
    }
    return form;
  }

  public async zip(zipFilePath: string, sourceFileName: string, sourceDir: string) {
    const sourceFile = path.join(sourceDir, sourceFileName);
    return new Promise((resolve) => {
      const output = fs.createWriteStream(zipFilePath);
      const archive = archiver('zip');

    output.on('close', async () => {
      console.log('Archiving is successful');
      resolve(output);
    });

    archive.on('error', function (err: unknown) {
      throw err;
    });

    archive.pipe(output);
      archive.append(fs.createReadStream(sourceFile), { name: sourceFileName });
      archive.finalize();
    });
  }
}
