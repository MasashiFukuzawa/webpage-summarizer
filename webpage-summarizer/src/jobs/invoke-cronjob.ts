const invokeCronjob = (e: GoogleAppsScript.Events.SheetsOnChange) => {
  const sheet = e.source.getActiveSheet();

  if (sheet.getName() !== 'summaries') {
    return;
  }

  if (e.changeType !== 'EDIT') {
    return;
  }

  const urls = fetchTargetUrls();
  if (!urls.length) {
    return;
  }

  console.log('Invoking cronjob...');
  const spreadsheetId = SpreadsheetApp.getActiveSpreadsheet().getId();
  triggerGitHubActionsJob(spreadsheetId);
  console.log('Finish invoking cronjob.');
};
