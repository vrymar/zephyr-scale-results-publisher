import { Service } from './service';

export class Automation extends Service {
  constructor() {
    super();
  }

  public async publishCucumber(projectId: string, autoCreateTestCases: boolean, body) {
    const data = await this.postFileParams('automations/executions/cucumber', {
      projectKey: projectId,
      autoCreateTestCases: autoCreateTestCases},
      body);
    return data['body'];
  }

  public async publishJUnit(projectId: string, autoCreateTestCases: boolean, body) {
    const data = await this.postFileParams('automations/executions/junit', {
      projectKey: projectId,
      autoCreateTestCases: autoCreateTestCases},
      body);
    return data['body'];
  }

  public async publishCustomFormat(projectId: string, autoCreateTestCases: boolean, body) {
    const data = await this.postFileParams('automations/executions/custom', {
      projectKey: projectId,
      autoCreateTestCases: autoCreateTestCases },
      body);
      return data['body'];
  }
}
