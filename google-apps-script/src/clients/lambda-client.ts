const PARSER_API_URL =
  PropertiesService.getScriptProperties().getProperty('PARSER_API_URL')!;
const PARSER_API_TOKEN =
  PropertiesService.getScriptProperties().getProperty('PARSER_API_TOKEN')!;

const convertHtmlToMarkdown = (url: string): string => {
  const encodedURL = encodeURIComponent(url);
  const response = UrlFetchApp.fetch(`${PARSER_API_URL}?url=${encodedURL},`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.getContentText();
};
