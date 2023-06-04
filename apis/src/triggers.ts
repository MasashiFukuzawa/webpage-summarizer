const createTriggerForSummarizeFunction = () => {
  ScriptApp.newTrigger('summarize').timeBased().everyMinutes(1).create();
};

function deleteTriggerForSummarizeFunction() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach((trigger) => {
    if (trigger.getHandlerFunction() === 'summarize') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
}
