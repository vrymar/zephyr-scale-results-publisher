# Zephyr Scale API - Automation Results Publisher

## Overview
The tool provides an opportunity to update test cases status and publish automation test results into Zephyr Scale Cloud.  

## Requirements
- Requires Node.js 14.16+
- Set environment variable Zephyr API KEY: `export ZEPHYR_TOKEN=XXXXXXXXX`

## Documentation
Detailed Automation API requests and properties can be found here: [Zephyr Scale API](https://support.smartbear.com/zephyr-scale-cloud/api-docs/#tag/Automations)   
How to generate API KEY: [Generating API Access Tokens](https://support.smartbear.com/zephyr-scale-cloud/docs/rest-api/generating-api-access-tokens.html)  


## Installation
```
npm i zephyr-scale-results-publisher
```

## Usage (JavaScript is the best way)

```javascript
import { Automation, Folders, Utils } from 'zephyr-scale-results-publisher';

const folders = new Folders();
const automation = new Automation();
const utils = new Utils();

const projectKey = 'TGTB';
const autoCreateTestCases = true;
const zipFilePath = '/DIRECTORY/testResults.zip';
const sourceFilePath = '/DIRECTORY/cucumber.json';

// Zip source file
await utils.zip(zipFilePath, sourceFilePath);

// Create form data to publish results into the root Zephyr Test Cycles folder
// Note: Comment the line below, if customized Test Cycle properties are uncommented/used.
const formData = await utils.createFormData(zipFilePath);

// Create form data with customized Test Cycle properties and publish results into a specific Zephyr Test Cycles folder
// Uncomment 9 fields below and update their values according to your needs.
// const folderName = 'Some folder';
// const testCycleName = 'Test Cycle Name';
// const testCycleDescription = 'Some description';
// const jiraProjectVersion = 1;
// const maxResults = 20;
// const folderType = 'TEST_CYCLE';
// const folderId = await folders.getFolderIdByName(folderName, projectKey, maxResults, folderType);
// const testCycleJson = await utils.generateTestCycleJson(testCycleName, testCycleDescription, jiraProjectVersion, folderId);
// const formData = await utils.createFormData(zipFilePath, testCycleJson);

// Use one of the following options depending on the report file format:

// Publish Cucumber results into Zephyr Scale:
automation.publishCucumber(projectKey, autoCreateTestCases, formData).then((result) => {
  console.log(result);

  // Used to publish Cucumber feature or scenario tags with prefix @ZephyrLabel= are added to the test cases as labels. 
  // E.g. @ZephyrLabel=My_Label. My_Label will be added to the marked test case as label. 
  // If not provided, this feature is ignored. 
  testCases.updateTestCasesWithLables(sourceFilePath, projectKey, result.testCycle.key);

  
  // Used to publish Cucumber feature or scenario tags with prefix @ZephyrIssue= as linked Jira issues. 
  // E.g. @ZephyrIssue=QP-70. QP-70 will be added to the marked test case into Traceability -> Issues. 
  // If not provided, this feature is ignored. 
  // USAGE:
  // Create jira.properties file with the following content in the root or your project
  // jiraBaseUri=https://<YOUR_JIRA_CLOUD_ADDRESS>.atlassian.net/rest/api/3/  
  // jiraToken=<JIRA_TOKEN> (better to provide it as a GitHub secret or an environment variable. E.g. for Windows: set JIRA_TOKEN=xxxxxxxxxxxxxx)  
  // jiraUserEmail=<JIRA_USER_EMAIL> (better to provide it as a GitHub secret or an environment variable. E.g. for Windows: set JIRA_USER_EMAIL=john.smith@ah.nl)
  testCases.updateTestCasesWithIssues(sourceFilePath, projectKey, result.testCycle.key);
});

// Publish JUnit results into Zephyr Scale:
automation.publishJUnit(projectKey, autoCreateTestCases, formData).then((result) => {
  console.log(result);
});

// Publish Custom format results into Zephyr Scale:
automation.publishCustomFormat(projectKey, autoCreateTestCases, formData).then((result) => {
  console.log(result);
});

```
