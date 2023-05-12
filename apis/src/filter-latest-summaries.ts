const filterLatestSummaries = () => {
  const filter = (row: Summary) => {
    return row.date === today() && !!row.summary;
  };

  const latestSummaries = getSummaryData(filter).rows;

  if (!latestSummaries.length) return;

  const endColumnNum = 3;

  const sheet = getSheet('latest_summaries');

  sheet
    .getRange(START_ROW_NUM, START_COLUMN_NUM, sheet.getLastRow(), endColumnNum)
    .clear();

  const range = sheet.getRange(
    START_ROW_NUM,
    START_COLUMN_NUM,
    latestSummaries.length,
    endColumnNum
  );

  range.setValues(
    latestSummaries
      .sort((a, b) => b.rowNum - a.rowNum)
      .map((row) => [row.summary, row.url, row.date])
  );
};
