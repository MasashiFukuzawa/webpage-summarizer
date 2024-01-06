const fetchTargetUrls = (days: number = 1): string[] => {
  const today = dayjs.dayjs();
  const filter = (row: Summary) => {
    const isRecent = dayjs.dayjs(row.date).isAfter(today.subtract(days, 'day'));
    return !!row.url && !row.content && isRecent;
  };
  const { rows } = getSummaryData(filter);
  return rows.map((row) => row.url);
};
