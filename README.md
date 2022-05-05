# Zephyr Scale API - Automation Results Publisher

## Overview
The tool provides an opportunity to update test cases status and publish automation test results into Zephyr Scale Cloud.  

## Requirements
- Requires Node.js 14.16+
- Set environment variable Zephyr API KEY: `ZEPHYR_TOKEN=XXXXXXXXX`

## Documentation
Detailed Automation API requests and properties can be found here: [Zephyr Scale API](https://support.smartbear.com/zephyr-scale-cloud/api-docs/#tag/Automations)   
How to generate API KEY: [Generating API Access Tokens](https://support.smartbear.com/zephyr-scale-cloud/docs/rest-api/generating-api-access-tokens.html)  


## Installation
```
npm i zephyr-scale-results-publisher
```

## Usage

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
const formData = await utils.createFormData(zipFilePath);

// Create form data with customized Test Cycle properties and publish results into a specific Zephyr Test Cycles folder
const folderName = 'Some folder';
const testCycleName = 'Test Cycle Name';
const testCycleDescription = 'Some description';
const jiraProjectVersion = 1;
const maxResults = 20;
const folderType = 'TEST_CYCLE';
const folderId = await folders.getFolderIdByName(folderName, projectKey, maxResults, folderType);
const testCycleJson = await utils.generateTestCycleJson(testCycleName, testCycleDescription, jiraProjectVersion, folderId);
const formData = await utils.createFormData(zipFilePath, testCycleJson);

// Publish Cucumber results into Zephyr Scale
automation.publishCucumber(projectKey, autoCreateTestCases, formData).then((result) => {
  console.log(result);
});

// Publish JUnit results into Zephyr Scale
automation.publishJUnit(projectKey, autoCreateTestCases, formData).then((result) => {
  console.log(result);
});

// Publish Custom format results into Zephyr Scale
automation.publishCustomFormat(projectKey, autoCreateTestCases, formData).then((result) => {
  console.log(result);
});

```
