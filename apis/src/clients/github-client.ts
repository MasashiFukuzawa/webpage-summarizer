const GITHUB_BASE_URL = 'https://api.github.com';
const GITHUB_TOKEN =
  PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
const GITHUB_OWNER =
  PropertiesService.getScriptProperties().getProperty('GITHUB_OWNER');
const GITHUB_REPO =
  PropertiesService.getScriptProperties().getProperty('GITHUB_REPO');
const GITHUB_WORKFLOW_ID =
  PropertiesService.getScriptProperties().getProperty('GITHUB_WORKFLOW_ID');

const triggerGitHubActionsJob = (spreadsheetId: string): void => {
  const response = UrlFetchApp.fetch(
    `${GITHUB_BASE_URL}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/actions/workflows/${GITHUB_WORKFLOW_ID}/dispatches`,
    {
      method: 'post',
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
      payload: JSON.stringify({
        ref: 'master',
        inputs: {
          spreadsheetId,
        },
      }),
      muteHttpExceptions: true,
    }
  );

  const status = response.getResponseCode();
  const rawResponse = response.getContentText();

  if (status !== 204) {
    throw new Error(
      `Failed to request to GitHub. status: ${status}, response: ${rawResponse}`
    );
  }
};
