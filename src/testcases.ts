import { TestExecution } from './testexecution'
import { Service } from './service';
import { Utils } from './utils';
import { TestCase } from './model/testCase/testcase';

export class TestCases extends Service {

  constructor() {
    super();
  }

  public async getTestCase(testCaseKey = '') {
    const url = "testcases/" + testCaseKey;
    const response = await this.get(url);
    return response['body'];
  }

  public async updateTestCase(testCaseKey: string, testCase: TestCase) {
    const url = "testcases/" + testCaseKey;
    const response = await this.putJson(url, testCase);
    return response['body'];
  }

  public async getTestCases(testCasesKeys: string[]) {
    const testCases: TestCase[] = [];
    for (const key of testCasesKeys) {
      await this.getTestCase(key).then((result) => {
        testCases.push(result);
        return result;
      });
    }
    return testCases;
  }

  public async updateTestCasesWithLables(sourceFilePath: string, projectKey: string, testCycle: string) {
    const utils = new Utils();
    const testExecution = new TestExecution();

    const responseFromGetExecution = await testExecution.getTestExecutions(projectKey, testCycle);
    const scenariosKeys = await testExecution.getScenariosKeys(responseFromGetExecution);
    const testCases: TestCase[] = await this.getTestCases(scenariosKeys);
    const testCaseNameKeyMap = await this.mapTestCaseNameWithKey(testCases);
    const scenarioNameTags = await utils.getAllTagsFromResultsFile(sourceFilePath, "@ZephyrLabel");

    if (scenarioNameTags !== undefined && scenarioNameTags.size > 0) {
      for (const [name, tagsLabels] of scenarioNameTags) {
        if (tagsLabels.values().next().value !== undefined) {
          const testCase = await this.getTestCase(testCaseNameKeyMap.get(name));
          testCase.labels = tagsLabels;
          await this.updateTestCase(testCase.key, testCase);
          console.log(`Zephyr publisher: successfully updated test case "${testCase.name}" with labels: ${tagsLabels}.`);
        }
      }
    }
  }

  public async mapTestCaseNameWithKey(testCases: TestCase[]) {
    const testCaseNameKeyMap = new Map<string, string>();
    for (const testCase of testCases) {
      testCaseNameKeyMap.set(testCase.name, testCase.key);
    }
    return testCaseNameKeyMap;
  }
}
