# Zephyr Scale API - Automation Results Publisher

## Overview
The tool provides an opportunity to update test cases status and publish automation test results into Zephyr Scale Cloud.  

## Requirements
- Requires Node.js 16+
- Set env with zephyr API KEY: `ZEPHYR_TOKEN=XXXXXXXXX`

## Documentation
Detailed Automation API requests and properties can be found here: [Zephyr Scale API](https://support.smartbear.com/zephyr-scale-cloud/api-docs/#tag/Automations)   
How to generate API KEY: [Generating API Access Tokens](https://support.smartbear.com/zephyr-scale-cloud/docs/rest-api/generating-api-access-tokens.html)  


### Example (using Typescript)
Publish Cucumber results:

```javascript
import { Automation, Utils } from 'zephyr-scale-results-publisher';
import FormData from 'form-data';

const api = new Automation();
const utils = new Utils();

const zipFilePath = '/my-automation-project/testResults.zip';
const sourceFileName = 'cucumber.json';
const sourceDir = '/my-automation-project';

// create zip file of the results file.
await utils.zip(zipFilePath, sourceFileName, sourceDir);
// create form data with the generated zip file
const formData = await utils.createFormDataWithFile('file', zipFilePath);

// request parameters
const projectId = 'MY_JIRA_PROJECT';
const autoCreateTestCases = true;

api.publishCucumber(projectId, autoCreateTestCases, formData).then((result) => {
  console.log(result);
});
```


## TODO: 
1. Implement publish results into specific TestCycle folder  
