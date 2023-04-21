import { JiraIssue } from './model/jiraIssue/jiraissue';
import { JiraClient } from './jiraClient';

export class Jira extends JiraClient {

    constructor() {
        super();
    }

    public async getJiraIssues(issueKeys: string[]) {
        const jiraIssues: JiraIssue[] = [];
        for (const issueKey of issueKeys) {
            const url = "issue/" + issueKey;
            console.log(`Zephyr publisher: Jira URI to execute: ${url}`);
            const response = await this.get(url);
            jiraIssues.push(response['body']);
        }
        return jiraIssues;
    }

    public async getIssuesIds(jiraIssues: JiraIssue[]) {
        const ids: number[] = [];

        for (const jiraIssue of jiraIssues) {
            ids.push(jiraIssue.id);
        }
        return ids;
    }
}