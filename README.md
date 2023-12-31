# webpage-summarizer

[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)

System for summarizing the content of webpages by analyzing their HTML. Easily extract key information from any webpage and view it in a condensed format.

## Directory Structure

```sh
tree . -I node_modules
.
├── LICENSE
├── README.md
├── apis
│   ├── package-lock.json
│   ├── package.json
│   ├── src
│   │   ├── appsscript.json
│   │   ├── auth.ts
│   │   ├── clients
│   │   │   ├── chatgpt-client.ts
│   │   │   └── github-client.ts
│   │   ├── fetch-from-spreadsheet.ts
│   │   ├── filter-latest-summaries.ts
│   │   ├── index.ts
│   │   ├── invoke-cronjob.ts
│   │   ├── log-error.ts
│   │   ├── schema.ts
│   │   ├── summarize.ts
│   │   └── triggers.ts
│   └── tsconfig.json
├── cronjobs
│   ├── README.md
│   ├── dist
│   │   └── main.js
│   ├── package.json
│   ├── src
│   │   └── main.ts
│   ├── tsconfig.json
│   └── yarn.lock
└── scripts
    └── bookmarklet
        ├── bookmarklet-formatter.sh
        ├── sample_result.txt
        ├── webpage-summary-bookmarklet.js
        └── webpage-summary-bookmarklet.txt

8 directories, 27 files
```

## Setup

Folk this repository and clone it.

```sh
# example
git clone git@github.com:${YOUR_GITHUB_USER_NAME}/webpage-summarizer.git
```

### Apis (Google Apps Script)

1. Install clasp

```sh
npm install -g @google/clasp
```

2. Enable the Google Apps Script API: https://script.google.com/home/usersettings
3. Execute below commands

```sh
cd apis
npm install

clasp login
clasp create --title "webpage-summarizer" --type sheets --rootDir ./src
clasp push --force
clasp open
```

4. Set environment variables

- OPENAI_API_KEY: Your OpenAI API Key
- SPREADSHEET_ID: Your Spreadsheet ID
- WEBPAGE_SUMMARIZER_API_KEY: Any string you generate for easy authentication in Google Apps Script
- GITHUB_TOKEN: Your GitHub Personal Access Token
- GITHUB_OWNER: Your GitHub username
- GITHUB_REPO: Your GitHub repository name
- GITHUB_WORKFLOW_ID: Your GitHub Actions workflow ID

5. Prepare spreadsheet as follows

- `summaries` sheet
  - content (string)
  - summary (string)
  - url (string)
  - date (string)
- `prompts` sheet
  - instruction (string)
    - Write your own prompts for ChatGPT API. Note that you need two prompts for partial and full summary.
  - constraints (string)
    - Write your own prompts for ChatGPT API. Note that you need two prompts for partial and full summary.
  - type (string)
    - `partial` | `full`
- `latest_summaries` sheet
  - summary (string)
  - url (string)
  - date (string)
- `error_logs` sheet

6. Publish API
7. Copy your API URL and WEBPAGE_SUMMARIZER_API_KEY
8. Set triggers if needed

### Cronjobs

1. Add secrets to GitHub repository to use GitHub Actions.
2. Uncomment cron expressions in .github/workflows/html-to-markdown.yml.

### (Optional) Bookmarklet

Follow these steps to set up the bookmarklet:

Create a new bookmark in your browser. You can do this by right-clicking on your bookmarks bar and selecting "Add Page" or "Add Bookmark" depending on the browser you are using.

Give the bookmark a name (e.g., "Convert to Markdown").

In the URL field, copy and paste the following script:

```js
javascript:(function%20()%20%7B%0A%20%20const%20d%20%3D%20document%3B%0A%20%20let%20s%20%3D%20d.createElement('script')%3B%0A%20%20s.src%20%3D%20'https%3A%2F%2Funpkg.com%2Fturndown%405.0.3%2Fdist%2Fturndown.js'%3B%0A%20%20s.onload%20%3D%20async%20function%20()%20%7B%0A%20%20%20%20const%20clonedBody%20%3D%20d.body.cloneNode(true)%3B%0A%0A%20%20%20%20const%20tags%20%3D%20%5B'header'%2C%20'footer'%2C%20'style'%2C%20'script'%2C%20'noscript'%5D%3B%0A%0A%20%20%20%20%2F%2F%20Remove%20the%20above%20tags%20beforehand%20as%20they%20create%20noise.%0A%20%20%20%20for%20(const%20tag%20of%20tags)%20%7B%0A%20%20%20%20%20%20const%20elements%20%3D%20clonedBody.getElementsByTagName(tag)%3B%0A%20%20%20%20%20%20for%20(let%20i%20%3D%20elements.length%20-%201%3B%20i%20%3E%3D%200%3B%20i--)%20%7B%0A%20%20%20%20%20%20%20%20elements%5Bi%5D.parentNode.removeChild(elements%5Bi%5D)%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%0A%20%20%20%20%2F%2F%20Convert%20to%20Markdown%20format%0A%20%20%20%20const%20turndownService%20%3D%20new%20TurndownService()%3B%0A%20%20%20%20const%20markdown%20%3D%20turndownService.turndown(clonedBody.innerHTML)%3B%0A%0A%20%20%20%20%2F%2F%20We%20remove%20the%20contents%20of%20the%20parentheses%0A%20%20%20%20%2F%2F%20because%20we%20believe%20that%20they%20often%20contain%20URLs%2C%20supplementary%20information%2C%0A%20%20%20%20%2F%2F%20and%20other%20strings%20that%20are%20meaningless%20to%20ChatGPT.%0A%20%20%20%20const%20trimmedMarkdown%20%3D%20markdown.replace(%2F%5C(%5B%5E()%5D*%5C)%2Fg%2C%20'')%3B%0A%0A%20%20%20%20const%20newWindow%20%3D%20window.open()%3B%0A%20%20%20%20newWindow.document.write('%3Cpre%3E'%20%2B%20trimmedMarkdown%20%2B%20'%3C%2Fpre%3E')%3B%0A%20%20%20%20newWindow.document.close()%3B%0A%20%20%7D%3B%0A%20%20d.body.appendChild(s)%3B%0A%7D)()%3B

```
