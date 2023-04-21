import got from 'got';

export class ZephyrClient {
  protected got;

  constructor() {
    this.got = got.extend({
      prefixUrl: 'https://api.zephyrscale.smartbear.com/v2',
      responseType: 'json',
      headers: {
        Authorization: `Bearer ${process.env.ZEPHYR_TOKEN}`
      }
    });
  }

  protected async get(path: string) {
    try {
      return await this.got.get(`${path}`);
    } catch (err) {
      console.error(`Zephyr publisher: error when doing GET request to endpoint ${path}`);
      if (err instanceof Error) {
        console.error(err.stack);
      }
      return err;
    }
  }

  protected async getQueryParameter(path: string, parameters) {
    try {
      return await this.got.get(`${path}`, { searchParams: parameters });
    } catch (err) {
      console.error(`Zephyr publisher: error when doing GET request to endpoint ${path}`);
      if (err instanceof Error) {
        console.error(err.stack);
      }
      return err;
    }
  }

  protected async postFile(path: string, body) {
    try {
      return await this.got.post(`${path}`, { body: body });
    } catch (err) {
      console.error(`Zephyr publisher: error when doing POST request to endpoint ${path}`);
      if (err instanceof Error) {
        console.error(err.stack);
      }
      return err;
    }
  }

  protected async postJson(path: string, body) {
    try {
      return await this.got.post(`${path}`, { json: body });
    } catch (err) {
      console.error(`Zephyr publisher: error when doing POST request to endpoint ${path}`);
      if (err instanceof Error) {
        console.error(err.stack);
      }
      return err;
    }
  }

  protected async putJson(path: string, body) {
    try {
      return await this.got.put(`${path}`, { json: body });
    } catch (err) {
      console.error(`Zephyr publisher: error when doing PUT request to endpoint ${path}`);
      if (err instanceof Error) {
        console.error(err.stack);
      }
      return err;
    }
  }

  protected async postFileParams(path: string, parameters, body) {
    try {
      return await this.got.post(`${path}`, { searchParams: parameters, body: body });
    } catch (err) {
      console.error(`Zephyr publisher: error when doing POST request to endpoint ${path}`);
      console.info("Zephyr publisher: Note: response code 400 doesn't mean the results were not published. Please check Zephyr Scale Tests and Cycles.");
      if (err instanceof Error) {
        console.error(err.stack);
      }
      return err;
    }
  }
}
