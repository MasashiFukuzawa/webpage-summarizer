const invokeHtmlToMarkdown = (e: GoogleAppsScript.Events.SheetsOnChange) => {
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

  console.log('Invoking html2markdown job...');
  const spreadsheetId = SpreadsheetApp.getActiveSpreadsheet().getId();
  triggerGitHubActionsJob(spreadsheetId);
  console.log('Finish invoking html2markdown job.');
};
