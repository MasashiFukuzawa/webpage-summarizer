const fetchTargetUrls = (): string[] => {
  const filter = (row: Summary) => !!row.url && !row.content;
  const { rows } = getSummaryData(filter);
  return rows.map((row) => row.url);
};
