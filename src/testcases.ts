import { TestExecution } from './testexecution'
import { ZephyrClient } from './zephyrClient';
import { Utils } from './utils';
import { TestCase } from './model/testCase/testcase';
import { JiraIssue } from './model/jiraIssue/jiraissue';
import { Jira } from './jira';

export class TestCases extends ZephyrClient {

  constructor() {
    super();
  }

  private async getTestCase(testCaseKey = '') {
    const url = "testcases/" + testCaseKey;
    const response = await super.get(url);
    return response['body'];
  }

  private async updateTestCase(testCaseKey: string, testCase: TestCase) {
    const url = "testcases/" + testCaseKey;
    const response = await super.putJson(url, testCase);
    return response['body'];
  }

  private async getTestCases(testCasesKeys: string[]) {
    const testCases: TestCase[] = [];
    for (const key of testCasesKeys) {
      await this.getTestCase(key).then((result) => {
        testCases.push(result);
        return result;
      });
    }
    return testCases;
  }

  private async getTestCaseLinks(testCaseKey: number) {
    const url = "testcases/" + testCaseKey + "/links";
    const response = await super.get(url);
    return response['body'];
  }

  private async createIssueLink(testCaseKey: number, issuesIds: number[]) {
    const url = "testcases/" + testCaseKey + "/links/issues";
    console.log(`Zephyr publisher: URI to execute: ${url}`);

    for (const issueId of issuesIds) {
      const isAttached = await this.isLinkAttachedToTestCase(testCaseKey, issueId);

      if (!isAttached) {
        const jsonBody = JSON.parse(`{"issueId": "${issueId}"}`);
        const response = await this.postJson(url, jsonBody);
        return response;
      } else {
        console.log(`Zephyr publisher: test case ${testCaseKey} already contains linked issueId ${issueId}`);
      }
    }
  }

  private async isLinkAttachedToTestCase(testCaseKey: number, issueId: number) {
    const links = await this.getTestCaseLinks(testCaseKey);
    for (const issue of links.issues) {
      if (Number(issue.issueId) === Number(issueId)) {
        return true;
      }
    }
    return false;
  }

  public async updateTestCasesWithLables(sourceFilePath: string, projectKey: string, testCycleKey: string) {
    const utils = new Utils();
    const testExecution = new TestExecution();

    const responseFromGetExecution = await testExecution.getTestExecutions(projectKey, testCycleKey);
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

  private async mapTestCaseNameWithKey(testCases: TestCase[]) {
    const testCaseNameKeyMap = new Map<string, string>();
    for (const testCase of testCases) {
      testCaseNameKeyMap.set(testCase.name, testCase.key);
    }
    return testCaseNameKeyMap;
  }

  public async updateTestCasesWithIssues(sourceFilePath: string, projectKey: string, testCycleKey: string) {
    const utils = new Utils();
    const testExecution = new TestExecution();
    const jira = new Jira();

    const responseFromGetExecution = await testExecution.getTestExecutions(projectKey, testCycleKey);
    const scenariosKeys = await testExecution.getScenariosKeys(responseFromGetExecution);
    const testCases: TestCase[] = await this.getTestCases(scenariosKeys);
    const testCaseNameKeyMap = await this.mapTestCaseNameWithKey(testCases);
    const scenarioNameTags = await utils.getAllTagsFromResultsFile(sourceFilePath, "@ZephyrIssue");

    if (scenarioNameTags !== undefined && scenarioNameTags.size > 0) {
      for (const [name, tagsIssues] of scenarioNameTags) {

        if (tagsIssues.values().next().value !== undefined) {
          const testCase = await this.getTestCase(testCaseNameKeyMap.get(name));
          const jiraIssues: JiraIssue[] = await jira.getJiraIssues(tagsIssues);

          if (jiraIssues.length > 0) {
            const issuesIds = await jira.getIssuesIds(jiraIssues);
            const response = await this.createIssueLink(testCase.key, issuesIds)
            if (response !== undefined && response.statusCode >= 200 && response.statusCode < 300) {
              console.log(`Zephyr publisher: successfully updated test case "${testCase.name}" with issues: ${tagsIssues}.`);
            }
          }
        }
      }
    }
  }
}