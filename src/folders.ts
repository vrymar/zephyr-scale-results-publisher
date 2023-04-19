import { Service } from './service';

export class Folders extends Service {
  constructor() {
    super();
  }

  public async getFolders(
    projectKey = '',
    maxResults = 10,
    startAt = 0,
    folderType = '',
  ) {
    const searchParams = {
      projectKey: projectKey === '' ? null : projectKey,
      folderType: folderType === '' ? null : folderType,
      maxResults: maxResults,
      startAt: startAt,
    };
    const data = await this.getQueryParameter(`folders`, searchParams);
    return data['body'];
  }

  public async createFolder(folderName: string, projectKey: string, folderType: string, parentId = 0) {
    const body = {
      parentId: parentId === 0 ? null : parentId,
      name: folderName,
      projectKey: projectKey,
      folderType: folderType,
    };
    const data = await this.postJson('folders', body);
    return data['body'];
  }

  public async getFolderById(id: string) {
    const data = await this.get(`folders/${id}`);
    return data['body'];
  }

  public async getFolderIdByName(
    folderName: string,
    projectKey: string,
    maxResults = 20,
    folderType = 'TEST_CYCLE',
  ) {
    const data = await this.getFolders(projectKey, maxResults, 0, folderType).then((result) => {
      return this.findFolderInResponse(folderName, result);
    });
    const id = data.id;
    console.info(`Zephyr publisher: found folder id: ${id}`);
    return id;
  }

  private async findFolderInResponse(folderName = '', responseBody: string) {
    console.info(`Zephyr publisher: start looking for a folder by name: ${folderName}`);
    const stringData = JSON.stringify(responseBody);
    const jsonParsed = JSON.parse(stringData);
    const result = jsonParsed.values.find((obj: { name: string; }) => {
      if (obj.name === folderName) {
        return obj;
      }
    });
    console.info(`Zephyr publisher: found folder: ${JSON.stringify(result)}`);
    return result;
  }
}
