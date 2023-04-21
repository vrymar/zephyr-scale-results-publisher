import { ZephyrClient } from './zephyrClient';

export class Automation extends ZephyrClient {
  constructor() {
    super();
  }

  public async publishCucumber(projectId: string, autoCreateTestCases: boolean, body: unknown) {
    const data = await this.postFileParams('automations/executions/cucumber', {
      projectKey: projectId,
      autoCreateTestCases: autoCreateTestCases
    },
      body);
    return data['body'];
  }

  public async publishJUnit(projectId: string, autoCreateTestCases: boolean, body: unknown) {
    const data = await this.postFileParams('automations/executions/junit', {
      projectKey: projectId,
      autoCreateTestCases: autoCreateTestCases
    },
      body);
    return data['body'];
  }

  public async publishCustomFormat(projectId: string, autoCreateTestCases: boolean, body: unknown) {
    const data = await this.postFileParams('automations/executions/custom', {
      projectKey: projectId,
      autoCreateTestCases: autoCreateTestCases
    },
      body);
    return data['body'];
  }
}
