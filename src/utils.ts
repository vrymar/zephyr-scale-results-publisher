import archiver from 'archiver';
import FormData from 'form-data';
import fs, { existsSync } from 'fs';
import path from 'path';
import { TestResult } from './model/testResultCucumber/testResult';

export class Utils {

  private TAG_NAME_SPLITTER = "=";

  public async createFormData(filePath: string, testCycleJson = null) {
    const form = new FormData();
    if (existsSync(filePath)) {
      const dataFile = fs.createReadStream(filePath);
      form.append('file', dataFile);
      if (testCycleJson != null) {
        form.append('testCycle', testCycleJson, { contentType: 'application/json' });
      }
    } else {
      console.error(`Zephyr publisher: results file was not found: ${filePath}`);
    }
    return form;
  }

  public async generateTestCycleJson(name: string, description = '', jiraProjectVersion = 1, folderId: number, customFields = {}) {
    const obj = {
      name: name,
      description: description,
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
        console.log(`Zephyr publisher: zipped successfully: ${zipFilePath}`);
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

  public async getAllTagsFromResultsFile(sourceFilePath: string, tagPrefix: string) {
    const results = await this.readResultsFile(sourceFilePath);

    try {
      if (results !== undefined) {
        const testScenarioNameTags = await this.getTestScenarioNameAndTagsFromResultsFile(results, tagPrefix);
        const featureTags = await this.getFeatureTagsFromResultsFile(results, tagPrefix);

        for (const [name, tags] of testScenarioNameTags) {
          const newTags = tags.concat(featureTags);
          testScenarioNameTags.set(name, newTags);
        }

        return testScenarioNameTags;
      }
    } catch (err) {
      console.error(`Zephyr publisher: failed to get tags: ${err}`);
    }
  }

  private async getTestScenarioNameAndTagsFromResultsFile(results: TestResult[], tagPrefix: string) {
    const testScenarioNameTags = new Map<string, string[]>();

    for (const result of results) {
      for (const element of result.elements) {
        const tags: string[] = [];
        if (element.tags !== undefined && element.tags.length > 0) {
          for (const tag of element.tags) {
            if (tag.name.includes(tagPrefix + this.TAG_NAME_SPLITTER)) {
              const tagArray = tag.name.split(this.TAG_NAME_SPLITTER);
              tags.push(tagArray[tagArray.length - 1]);
            }
          }
        }
        testScenarioNameTags.set(result.name + ": " + element.name, tags);
      }
    }
    return testScenarioNameTags;
  }


  private async readResultsFile(sourceFilePath: string) {
    try {
      const fileData = fs.readFileSync(sourceFilePath, 'utf-8');
      const results: TestResult[] = JSON.parse(fileData);
      return results;
    } catch (err) {
      console.error(`Zephyr publisher: error reading JSON file or finding the element in the file: ${err}`);
    }
  }

  private async getFeatureTagsFromResultsFile(results: TestResult[], tagPrefix: string) {
    const tags: string[] = [];
    for (const result of results) {
      if (result.tags !== undefined && result.tags.length > 0) {
        for (const tag of result.tags) {
          if (tag.name.includes(tagPrefix + this.TAG_NAME_SPLITTER)) {
            const tagArray = tag.name.split(this.TAG_NAME_SPLITTER);
            tags.push(tagArray[tagArray.length - 1]);
          }
        }
      }
    }
    return tags;
  }
}
