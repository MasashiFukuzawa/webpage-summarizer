// Add env
const setEnvironmentVariables = () => {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const spreadsheetId = spreadsheet.getId();

  PropertiesService.getScriptProperties().setProperty(
    'SPREADSHEET_ID',
    spreadsheetId
  );
  PropertiesService.getScriptProperties().setProperty(
    'OPENAI_API_KEY',
    'YOUR_OPENAI_API_KEY'
  );
  PropertiesService.getScriptProperties().setProperty(
    'WEBPAGE_SUMMARIZER_API_KEY',
    'YOUR_WEBPAGE_SUMMARIZER_API_KEY'
  );
  PropertiesService.getScriptProperties().setProperty(
    'GITHUB_TOKEN',
    'YOUR_GITHUB_TOKEN'
  );
  PropertiesService.getScriptProperties().setProperty(
    'GITHUB_OWNER',
    'YOUR_GITHUB_USERNAME'
  );
  PropertiesService.getScriptProperties().setProperty(
    'GITHUB_REPO',
    'YOUR_GITHUB_REPO'
  );
  PropertiesService.getScriptProperties().setProperty(
    'GITHUB_WORKFLOW_ID',
    'YOUR_GITHUB_WORKFLOW_ID'
  );
};

// Prepare a trigger for regularly executing summaries by ChatGPT.
const createTriggerForSummarizeFunction = () => {
  ScriptApp.newTrigger('summarize').timeBased().everyMinutes(1).create();
};

// Prepare a trigger for invoking a cronjob.
const createTriggerForInvokeCronjobFunction = function () {
  ScriptApp.newTrigger('invokeCronjob')
    .forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet())
    .onChange()
    .create();
};

// Reset all triggers.
const deleteTriggers = () => {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach((trigger) => {
    ScriptApp.deleteTrigger(trigger);
  });
};

// A function to collectively execute the above. It only needs to be run once.
const setUp = () => {
  setEnvironmentVariables();
  createTriggerForSummarizeFunction();
  createTriggerForInvokeCronjobFunction();
};
