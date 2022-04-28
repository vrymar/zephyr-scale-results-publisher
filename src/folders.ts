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

  public async getFolderId(id: string) {
    const data = await this.methodGET(`folders/${id}`);
    return data['body'];
  }
}
