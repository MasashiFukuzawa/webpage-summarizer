const setTriggers = () => {
  const functions = ['invokeCronjob', 'summarize'];
  functions.forEach((func) => {
    ScriptApp.newTrigger(func)
      .forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet())
      .onChange()
      .create();
  });
};

function deleteTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach((trigger) => {
    ScriptApp.deleteTrigger(trigger);
  });
}
