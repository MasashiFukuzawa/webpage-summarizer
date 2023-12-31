const invokeCronjob = () => {
  console.log('Starting cronjob...');
  triggerGitHubActionsJob();
  console.log('Finish invoking cronjob.');
};
