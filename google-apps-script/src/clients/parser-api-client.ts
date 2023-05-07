const PARSER_API_URL =
  PropertiesService.getScriptProperties().getProperty('PARSER_API_URL')!;
const PARSER_API_TOKEN =
  PropertiesService.getScriptProperties().getProperty('PARSER_API_TOKEN')!;

const convertHtmlToMarkdown = (url: string): string => {
  const encodedURL = encodeURIComponent(url);
  const response = UrlFetchApp.fetch(
    `${PARSER_API_URL}/api?url=${encodedURL},`,
    {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (response.getResponseCode() !== 200) {
    throw new Error(
      `[ERROR] status=${response.getResponseCode()} response=${response.getContentText()}`
    );
  }

  const responseObject: ParserAPIResponse = JSON.parse(
    response.getContentText()
  );

  return responseObject.markdown;
};
