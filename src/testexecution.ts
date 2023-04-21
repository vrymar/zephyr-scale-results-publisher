import { ZephyrClient } from './zephyrClient';

export class TestExecution extends ZephyrClient {
  constructor() {
    super();
  }

  public async getTestExecutions(
    projectKey = '',
    testCycle = '',
    onlyLastExecutions = true
  ) {
    const searchParams = {
      projectKey: projectKey === '' ? null : projectKey,
      testCycle: testCycle === '' ? null : testCycle,
      onlyLastExecutions: onlyLastExecutions
    };
    const data = await this.getQueryParameter(`testexecutions`, searchParams);
    return data['body'];
  }

  public async getScenariosKeys(testExecution) {
    const keys: string[] = [];
    testExecution.values.forEach(value => {
      const url = value.testCase.self;
      const array = url.split('/');
      const key = array[array.length - 3];
      keys.push(key);
    });

    return keys;
  }
}
