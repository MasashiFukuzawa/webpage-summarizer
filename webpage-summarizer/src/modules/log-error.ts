const logError = (error: Error) => {
  const logsSheet = getSheet('error_logs');
  const timestamp = new Date();
  const errorMessage = error.message;
  const errorStack = error.stack;
  logsSheet.appendRow([timestamp, errorMessage, errorStack]);
};
