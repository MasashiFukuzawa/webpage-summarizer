const authorize = (apiKey?: string) => {
  const key = PropertiesService.getScriptProperties().getProperty(
    'WEBPAGE_SUMMARIZER_API_KEY'
  );
  if (apiKey !== key) {
    throw new Error('Unauthorized.');
  }
};
