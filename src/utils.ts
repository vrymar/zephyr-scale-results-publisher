import archiver from 'archiver';
import FormData from 'form-data';
import fs, { existsSync } from 'fs';
import path from 'path';

export class Utils {

  public async createFormData(filePath: string, testCycleJson = null) {
    const form = new FormData();
    if (existsSync(filePath)) {
      const dataFile = fs.createReadStream(filePath);
      form.append('file', dataFile);
      if (testCycleJson != null){
        form.append('testCycle', testCycleJson, {contentType: 'application/json'});
      }      
    } else {
      console.error(`Results file was not found: ${filePath}`);
    }
    return form;
  }

  public async generateTestCycleJson(name: string, description = '', jiraProjectVersion = 1, folderId: number, customFields = {}) {
    const obj = {
      name: name,
      description : description,
      jiraProjectVersion: jiraProjectVersion,
      folderId: folderId,
      customFields: customFields
    };
    return JSON.stringify(obj);
  }

  public async zip(zipFilePath: string, sourceFilePath: string) {
    const sourceFileName = path.basename(sourceFilePath);
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
        archive.append(fs.createReadStream(sourceFilePath), { name: sourceFileName });
        archive.finalize();
    });
  }
}
