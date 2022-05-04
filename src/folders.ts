import { Service } from './service';

export class Folders extends Service {
  constructor() {
    super();
  }

  public async getFolders(
    projectKey: string = '',
    maxResults: number = 10,
    startAt: number = 0,
    folderType: string = '',
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

  public async createFolder(folderName: string, projectKey: string, folderType: string, parentId: number = 0) {
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
    const data = await this.methodGET(`folders/${id}`);
    return data['body'];
  }

  public async getFolderPropertiesByName(
    folderName: string = '',
    projectKey: string = '',
    maxResults: number = 10,
    folderType: string = '',
    ) {
    const data = this.getFolders(projectKey, maxResults, 0, folderType).then((result) => {
      return this.findFolderInResponse(folderName, result);
    });
    return data;
  }

  private async findFolderInResponse(folderName: string = '', responseBody: string) {
    console.info(`Start looking for a folder by name: ${folderName}`);
    var stringData = JSON.stringify(responseBody);
    var jsonParsed = JSON.parse(stringData);
    var result = jsonParsed.values.find((obj: { name: string; }) => {
      if (obj.name === folderName) {
        return obj;
      }
    });
    console.info(`Found folder: ${JSON.stringify(result)}`);
    return result;
  }
}
