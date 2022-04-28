import got from 'got';

export class Service {
  protected got;

  constructor() {
    this.got = got.extend({
      prefixUrl: 'https://api.zephyrscale.smartbear.com/v2',
      responseType: 'json',
      headers: { Authorization: `Bearer ${process.env.ZEPHYR_TOKEN}` },
    });
  }

  protected async methodGET(path: string) {
    try {
      return await this.got.get(`${path}`);
    } catch (err) {
      console.error(`Error when doing GET request to endpoint ${path}`);
      return err;
    }
  }

  protected async getQueryParameter(path: string, parameters) {
    try {
      return await this.got.get(`${path}`, { searchParams: parameters });
    } catch (err) {
      console.error(`Error when doing GET request to endpoint ${path}`);
      return err;
    }
  }

  protected async postFile(path: string, body) {
    try {
      return await this.got.post(`${path}`, { body: body });
    } catch (err) {
      console.error(`Error when doing POST request to endpoint ${path}`);
      return err;
    }
  }

  protected async postJson(path: string, body) {
    try {
      return await this.got.post(`${path}`, { json: body });
    } catch (err) {
      console.error(`Error when doing POST request to endpoint ${path}`);
      return err;
    }
  }

  protected async postFileParams(path: string, parameters, body) {
    try {
      return await this.got.post(`${path}`, { searchParams: parameters, body: body });
    } catch (err) {
      console.error(`Error when doing POST request to endpoint ${path}`);
      return err;
    }
  }
}
