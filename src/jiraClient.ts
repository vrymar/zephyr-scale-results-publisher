import got from 'got';
import { Buffer } from 'node:buffer';
import { TextEncoder } from 'util';
import PropertiesReader from 'properties-reader';

export class JiraClient {

    protected got;

    constructor() {
        const prop = PropertiesReader('jira.properties');

        let prefixUrl = process.env.JIRA_BASE_URI || null;
        let jiraToken = process.env.JIRA_TOKEN || null;
        let jiraUserEmail = process.env.JIRA_USER_EMAIL || null;

        if (prefixUrl === null) {
            console.log("Zephyr publisher: Jira base URL environment variable is undefined. Getting it from jira.properties");
            prefixUrl = prop.get('jiraBaseUri') as string;
        }

        if (jiraToken === null) {
            console.log("Zephyr publisher: Jira token environment variable is undefined. Getting it from jira.properties");
            jiraToken = prop.get('jiraToken') as string;
        }

        if (jiraUserEmail === null) {
            console.log("Zephyr publisher: Jira user email environment variable is undefined. Getting it from jira.properties");
            jiraUserEmail = prop.get('jiraUserEmail') as string;
        }

        this.getBasicAuth(jiraUserEmail, jiraToken).then((result) => {
            this.got = got.extend({
                prefixUrl: `${prefixUrl}`,
                responseType: 'json',
                headers: {
                    Authorization: `${result}`
                },
            });
        });
    }

    private async getBasicAuth(username: string, password: string) {
        const valueToEncode = username + ':' + password;
        const encoder = new TextEncoder();
        const encoded = encoder.encode(valueToEncode);
        const buf = Buffer.from(encoded.buffer, encoded.byteOffset, encoded.byteLength);
        return 'Basic ' + buf.toString('base64');
    }

    public async get(path: string) {
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
}
