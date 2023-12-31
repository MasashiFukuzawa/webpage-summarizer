const createTriggerForSummarizeFunction = () => {
  ScriptApp.newTrigger('summarize').timeBased().everyMinutes(1).create();
};

const createTriggerForInvokeCronjobFunction = () => {
  ScriptApp.newTrigger('invokeCronjob').timeBased().everyMinutes(1).create();
};

function deleteTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach((trigger) => {
    ScriptApp.deleteTrigger(trigger);
  });
}
